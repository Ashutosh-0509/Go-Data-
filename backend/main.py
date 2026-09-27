from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
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

app = FastAPI(
    title="Data Analyst & ML API",
    description="Backend service providing data profiling, cleaning, outlier handling, EDA, and ML models.",
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json"
)

# Enable CORS for Next.js frontend (allowing all origins for seamless development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_stats(df: pd.DataFrame):
    total_cells = int(df.size)
    missing_cells = int(df.isna().sum().sum())
    missing_pct = round((missing_cells / total_cells * 100.0) if total_cells > 0 else 0.0, 2)
    total_rows = int(len(df))
    duplicate_rows = int(df.duplicated().sum())
    duplicate_pct = round((duplicate_rows / total_rows * 100.0) if total_rows > 0 else 0.0, 2)
    raw_score = 100.0 - (0.5 * missing_pct) - (0.5 * duplicate_pct)
    score = round(float(np.clip(raw_score, 0.0, 100.0)), 1)
    
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    categorical_cols = [c for c in df.columns if c not in numeric_cols]
    
    # First 50 records for rich table view
    preview = df.head(50).fillna("").to_dict(orient="records")
    
    # Privacy detection
    privacy_flags = []
    email_regex = re.compile(r"[^@\s]+@[^@\s]+\.[^@\s]+")
    phone_regex = re.compile(r"^\+?1?\d{9,15}$")
    for col in df.columns:
        sample = df[col].dropna().astype(str).head(50)
        if any(sample.str.match(email_regex)):
            privacy_flags.append({"column": col, "type": "Email Addresses"})
        elif any(sample.str.match(phone_regex)):
            privacy_flags.append({"column": col, "type": "Phone Numbers"})
    
    # Column metadata for tooltips & technical analysis
    column_metadata = {}
    for col in df.columns:
        is_num = col in numeric_cols
        null_count = int(df[col].isna().sum())
        unique_count = int(df[col].nunique())
        meta = {
            "type": "Numeric" if is_num else "Categorical",
            "null_count": null_count,
            "unique_count": unique_count,
            "null_pct": round((null_count / total_rows * 100), 1) if total_rows > 0 else 0.0
        }
        if is_num:
            non_null = df[col].dropna()
            if not non_null.empty:
                meta["mean"] = round(float(non_null.mean()), 2)
                meta["std"] = round(float(non_null.std()), 2) if len(non_null) > 1 else 0.0
                meta["min"] = round(float(non_null.min()), 2)
                meta["max"] = round(float(non_null.max()), 2)
        column_metadata[col] = meta

    return {
        "score": score,
        "missing_pct": missing_pct,
        "duplicate_pct": duplicate_pct,
        "total_cells": total_cells,
        "missing_cells": missing_cells,
        "duplicate_rows": duplicate_rows,
        "total_rows": total_rows,
        "columns": df.columns.tolist(),
        "numeric_cols": numeric_cols,
        "categorical_cols": categorical_cols,
        "column_metadata": column_metadata,
        "preview": preview,
        "privacy_flags": privacy_flags
    }

@app.get("/")
def root():
    return {
        "message": "Data Analyst API is running",
        "docs": "/docs",
        "status": "healthy"
    }

@app.get("/health")
@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        filename_lower = (file.filename or "dataset.csv").lower()
        contents = await file.read()
        
        if filename_lower.endswith(".csv") or filename_lower.endswith(".txt"):
            try:
                df = pd.read_csv(io.BytesIO(contents), encoding="utf-8")
            except UnicodeDecodeError:
                try:
                    df = pd.read_csv(io.BytesIO(contents), encoding="utf-8-sig")
                except UnicodeDecodeError:
                    df = pd.read_csv(io.BytesIO(contents), encoding="latin-1")
        elif filename_lower.endswith((".xls", ".xlsx")):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            # Fallback attempt as CSV
            try:
                df = pd.read_csv(io.BytesIO(contents))
            except Exception:
                raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a .csv, .xlsx, or .xls file.")

        # Ensure column names are clean strings
        df.columns = [str(c).strip() for c in df.columns]
        csv_str = df.to_csv(index=False)
        return {"stats": get_stats(df), "csv_data": csv_str, "filename": file.filename or "dataset.csv"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse dataset: {str(e)}")

@app.post("/api/clean")
async def clean_data(csv_data: str = Form(...), strategy: str = Form(...), remove_duplicates: bool = Form(...)):
    try:
        df = pd.read_csv(io.StringIO(csv_data))
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        non_numeric_cols = [c for c in df.columns if c not in numeric_cols]
        
        if strategy == "Drop rows": 
            df = df.dropna()
        elif strategy == "Mean":
            for col in numeric_cols: 
                df[col] = df[col].fillna(df[col].mean())
            for col in non_numeric_cols: 
                mode_vals = df[col].mode()
                if not mode_vals.empty: 
                    df[col] = df[col].fillna(mode_vals[0])
        elif strategy == "Median":
            for col in numeric_cols: 
                df[col] = df[col].fillna(df[col].median())
            for col in non_numeric_cols: 
                mode_vals = df[col].mode()
                if not mode_vals.empty: 
                    df[col] = df[col].fillna(mode_vals[0])
                    
        if remove_duplicates: 
            df = df.drop_duplicates()
            
        df = df.reset_index(drop=True)
        return {"stats": get_stats(df), "csv_data": df.to_csv(index=False)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cleaning failed: {str(e)}")

@app.post("/api/outliers")
async def handle_outliers(csv_data: str = Form(...), method: str = Form(...), action: str = Form(...)):
    try:
        df = pd.read_csv(io.StringIO(csv_data))
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        if not numeric_cols: 
            return {"stats": get_stats(df), "csv_data": csv_data}
            
        if method == "Z-score":
            z_scores = np.abs(stats.zscore(df[numeric_cols].fillna(0)))
            outliers = (z_scores > 3)
        else:
            Q1 = df[numeric_cols].quantile(0.25)
            Q3 = df[numeric_cols].quantile(0.75)
            IQR = Q3 - Q1
            outliers = ((df[numeric_cols] < (Q1 - 1.5 * IQR)) | (df[numeric_cols] > (Q3 + 1.5 * IQR)))
            
        if action == "Remove": 
            df = df[~outliers.any(axis=1)]
        elif action == "Cap":
            for col in numeric_cols:
                if method == "Z-score":
                    mean, std = df[col].mean(), df[col].std()
                    std_val = std if std > 0 else 1.0
                    lower, upper = mean - 3*std_val, mean + 3*std_val
                else:
                    q1, q3 = df[col].quantile(0.25), df[col].quantile(0.75)
                    iqr = q3 - q1
                    lower, upper = q1 - 1.5*iqr, q3 + 1.5*iqr
                df[col] = np.clip(df[col], lower, upper)
                
        df = df.reset_index(drop=True)
        return {"stats": get_stats(df), "csv_data": df.to_csv(index=False)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Outlier treatment failed: {str(e)}")

@app.post("/api/eda")
async def get_eda(csv_data: str = Form(...), column: str = Form(...)):
    try:
        df = pd.read_csv(io.StringIO(csv_data))
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        hist_data = []
        if column in numeric_cols:
            col_data = df[column].dropna()
            if not col_data.empty:
                counts, bins = np.histogram(col_data, bins=12)
                for i in range(len(counts)): 
                    hist_data.append({"bin": f"{bins[i]:.1f}-{bins[i+1]:.1f}", "count": int(counts[i])})
        corr_matrix = df[numeric_cols].corr().fillna(0).round(2).to_dict()
        return {"histogram": hist_data, "correlation": corr_matrix, "numeric_cols": numeric_cols}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"EDA calculation failed: {str(e)}")

@app.post("/api/train")
async def train_models(csv_data: str = Form(...), target: str = Form(...)):
    try:
        df = pd.read_csv(io.StringIO(csv_data)).dropna()
        if target not in df.columns: 
            raise HTTPException(status_code=400, detail="Target column not found in dataset")
        
        y = df[target]
        X = df.drop(columns=[target])
        # Simple encoding for categorical columns
        X = pd.get_dummies(X, drop_first=True)
        
        if X.empty:
            raise HTTPException(status_code=400, detail="No feature columns available to train on.")
            
        is_classification = df[target].dtype == object or df[target].nunique() < 20
        task_type = "Classification" if is_classification else "Regression"
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        leaderboard = []
        
        if is_classification:
            models = {
                "Logistic Regression": LogisticRegression(max_iter=100),
                "Decision Tree Classifier": DecisionTreeClassifier(max_depth=5),
                "Random Forest Classifier": RandomForestClassifier(n_estimators=10, max_depth=5, random_state=42)
            }
            for name, model in models.items():
                try:
                    model.fit(X_train, y_train)
                    preds = model.predict(X_test)
                    acc = accuracy_score(y_test, preds)
                    leaderboard.append({"model": name, "metric": "Accuracy", "score": f"{round(acc * 100, 1)}%"})
                except Exception:
                    pass
        else:
            models = {
                "Linear Regression": LinearRegression(),
                "Decision Tree Regressor": DecisionTreeRegressor(max_depth=5),
                "Random Forest Regressor": RandomForestRegressor(n_estimators=10, max_depth=5, random_state=42)
            }
            for name, model in models.items():
                try:
                    model.fit(X_train, y_train)
                    preds = model.predict(X_test)
                    r2 = r2_score(y_test, preds)
                    leaderboard.append({"model": name, "metric": "R² Score", "score": round(r2, 4)})
                except Exception:
                    pass
                
        leaderboard.sort(key=lambda x: x["score"], reverse=True)
        return {"task_type": task_type, "leaderboard": leaderboard}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model training error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
