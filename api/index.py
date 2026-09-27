from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
import io
import json
from scipy import stats
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.metrics import accuracy_score, r2_score, mean_squared_error
import re
import os

try:
    import google.generativeai as genai
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

def get_stats(df: pd.DataFrame):
    total_cells = df.size
    missing_cells = int(df.isna().sum().sum())
    missing_pct = (missing_cells / total_cells * 100.0) if total_cells > 0 else 0.0
    total_rows = len(df)
    duplicate_rows = int(df.duplicated().sum())
    duplicate_pct = (duplicate_rows / total_rows * 100.0) if total_rows > 0 else 0.0
    raw_score = 100.0 - (0.5 * missing_pct) - (0.5 * duplicate_pct)
    score = round(float(np.clip(raw_score, 0.0, 100.0)), 1)
    
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    categorical_cols = [c for c in df.columns if c not in numeric_cols]
    
    preview = df.head(20).fillna("").to_dict(orient="records")
    
    # Privacy detection
    privacy_flags = []
    email_regex = re.compile(r"[^@]+@[^@]+\.[^@]+")
    phone_regex = re.compile(r"^\+?1?\d{9,15}$")
    for col in df.columns:
        sample = df[col].dropna().astype(str).head(50)
        if any(sample.str.match(email_regex)):
            privacy_flags.append({"column": col, "type": "Email Addresses"})
        elif any(sample.str.match(phone_regex)):
            privacy_flags.append({"column": col, "type": "Phone Numbers"})
    
    return {
        "score": score,
        "missing_pct": round(missing_pct, 2),
        "duplicate_pct": round(duplicate_pct, 2),
        "total_cells": total_cells,
        "missing_cells": missing_cells,
        "duplicate_rows": duplicate_rows,
        "total_rows": total_rows,
        "columns": df.columns.tolist(),
        "numeric_cols": numeric_cols,
        "categorical_cols": categorical_cols,
        "preview": preview,
        "privacy_flags": privacy_flags
    }

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        if file.filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        elif file.filename.endswith((".xls", ".xlsx")):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
        csv_str = df.to_csv(index=False)
        return {"stats": get_stats(df), "csv_data": csv_str, "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/clean")
async def clean_data(csv_data: str = Form(...), strategy: str = Form(...), remove_duplicates: bool = Form(...)):
    df = pd.read_csv(io.StringIO(csv_data))
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    non_numeric_cols = [c for c in df.columns if c not in numeric_cols]
    if strategy == "Drop rows": df = df.dropna()
    elif strategy == "Mean":
        for col in numeric_cols: df[col] = df[col].fillna(df[col].mean())
        for col in non_numeric_cols: 
            if not df[col].mode().empty: df[col] = df[col].fillna(df[col].mode()[0])
    elif strategy == "Median":
        for col in numeric_cols: df[col] = df[col].fillna(df[col].median())
        for col in non_numeric_cols: 
            if not df[col].mode().empty: df[col] = df[col].fillna(df[col].mode()[0])
    if remove_duplicates: df = df.drop_duplicates()
    df = df.reset_index(drop=True)
    return {"stats": get_stats(df), "csv_data": df.to_csv(index=False)}

@app.post("/api/outliers")
async def handle_outliers(csv_data: str = Form(...), method: str = Form(...), action: str = Form(...)):
    df = pd.read_csv(io.StringIO(csv_data))
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    if not numeric_cols: return {"stats": get_stats(df), "csv_data": csv_data}
    if method == "Z-score":
        z_scores = np.abs(stats.zscore(df[numeric_cols].fillna(0)))
        outliers = (z_scores > 3)
    else:
        Q1 = df[numeric_cols].quantile(0.25)
        Q3 = df[numeric_cols].quantile(0.75)
        IQR = Q3 - Q1
        outliers = ((df[numeric_cols] < (Q1 - 1.5 * IQR)) | (df[numeric_cols] > (Q3 + 1.5 * IQR)))
    if action == "Remove": df = df[~outliers.any(axis=1)]
    elif action == "Cap":
        for col in numeric_cols:
            if method == "Z-score":
                mean, std = df[col].mean(), df[col].std()
                lower, upper = mean - 3*std, mean + 3*std
            else:
                q1, q3 = df[col].quantile(0.25), df[col].quantile(0.75)
                iqr = q3 - q1
                lower, upper = q1 - 1.5*iqr, q3 + 1.5*iqr
            df[col] = np.clip(df[col], lower, upper)
    df = df.reset_index(drop=True)
    return {"stats": get_stats(df), "csv_data": df.to_csv(index=False)}

@app.post("/api/eda")
async def get_eda(csv_data: str = Form(...), column: str = Form(...)):
    df = pd.read_csv(io.StringIO(csv_data))
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    hist_data = []
    if column in numeric_cols:
        col_data = df[column].dropna()
        if not col_data.empty:
            counts, bins = np.histogram(col_data, bins=15)
            for i in range(len(counts)): hist_data.append({"bin": f"{bins[i]:.1f}-{bins[i+1]:.1f}", "count": int(counts[i])})
    corr_matrix = df[numeric_cols].corr().fillna(0).round(2).to_dict()
    return {"histogram": hist_data, "correlation": corr_matrix, "numeric_cols": numeric_cols}

@app.post("/api/train")
async def train_models(csv_data: str = Form(...), target: str = Form(...)):
    try:
        df = pd.read_csv(io.StringIO(csv_data)).dropna()
        if target not in df.columns: raise HTTPException(status_code=400, detail="Target not found")
        
        y = df[target]
        X = df.drop(columns=[target])
        # Simple encoding for speed and to avoid Vercel timeouts
        X = pd.get_dummies(X, drop_first=True)
        
        is_classification = df[target].dtype == object or df[target].nunique() < 20
        task_type = "Classification" if is_classification else "Regression"
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        leaderboard = []
        
        if is_classification:
            models = {
                "Logistic Regression": LogisticRegression(max_iter=100),
                "Decision Tree": DecisionTreeClassifier(max_depth=5),
                "Random Forest": RandomForestClassifier(n_estimators=5, max_depth=5)
            }
            for name, model in models.items():
                model.fit(X_train, y_train)
                preds = model.predict(X_test)
                acc = accuracy_score(y_test, preds)
                leaderboard.append({"model": name, "metric": "Accuracy", "score": round(acc, 4)})
        else:
            models = {
                "Linear Regression": LinearRegression(),
                "Decision Tree": DecisionTreeRegressor(max_depth=5),
                "Random Forest": RandomForestRegressor(n_estimators=5, max_depth=5)
            }
            for name, model in models.items():
                model.fit(X_train, y_train)
                preds = model.predict(X_test)
                r2 = r2_score(y_test, preds)
                leaderboard.append({"model": name, "metric": "R2 Score", "score": round(r2, 4)})
                
        leaderboard.sort(key=lambda x: x["score"], reverse=True)
        return {"task_type": task_type, "leaderboard": leaderboard}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat_agent(csv_data: str = Form(...), message: str = Form(...)):
    df = pd.read_csv(io.StringIO(csv_data))
    message = message.lower()
    
    # 1. Grounded Pandas Tool Execution Engine
    if "correlation" in message or "corr" in message:
        numeric_df = df.select_dtypes(include=[np.number])
        if len(numeric_df.columns) >= 2:
            corr = numeric_df.corr().iloc[0, 1]
            col1, col2 = numeric_df.columns[0], numeric_df.columns[1]
            return {"reply": f"**[Grounded Tool Execution]** I ran `df.corr()` on the backend. The mathematical correlation between **{col1}** and **{col2}** is **{corr:.3f}**."}
            
    if "missing" in message or "null" in message:
        missing = df.isna().sum().sort_values(ascending=False).head(3)
        res = ", ".join([f"{k} ({v} missing)" for k,v in missing.items() if v > 0])
        if not res: res = "No missing values found."
        return {"reply": f"**[Grounded Tool Execution]** I executed `df.isna().sum()` on your dataset. Top missing columns: {res}"}
        
    if "average" in message or "mean" in message:
        numeric_df = df.select_dtypes(include=[np.number])
        if not numeric_df.empty:
            mean_val = numeric_df.iloc[:, 0].mean()
            col = numeric_df.columns[0]
            return {"reply": f"**[Grounded Tool Execution]** I computed the mean for **{col}**. It is strictly **{mean_val:.2f}**."}

    rows, cols = df.shape
    return {"reply": f"**[Grounded Assistant]** I am connected strictly to your live data. I can confirm this dataset has {rows} rows and {cols} columns. Try asking me to calculate a correlation, find missing values, or compute an average for specific data! I will execute real pandas code instead of guessing."}
