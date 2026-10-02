from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import pandas as pd
import numpy as np
import io
import json
from scipy import stats
from sklearn.model_selection import KFold, StratifiedKFold, cross_val_score
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.metrics import accuracy_score, r2_score
import re
import os

app = FastAPI(
    title="Smart Data Analyst & AutoML API",
    description="Backend service for data profiling, cleaning, outlier calibration, visual EDA, and AutoML benchmarking. Processed in memory, not stored persistently.",
    version="2.5.0",
    docs_url="/docs",
    openapi_url="/openapi.json"
)

# Explicit allowed origins list (Vercel production and local dev)
allowed_origins = [
    "https://frontend-delta-one-85s7raegfj.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
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
    
    # In-memory privacy scan
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
        "status": "ok",
        "service": "Smart Data Analyst API",
        "docs": "/docs",
        "version": "2.5.0",
        "privacy": "processed in memory, not stored persistently"
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
            try:
                df = pd.read_csv(io.BytesIO(contents))
            except Exception:
                raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a .csv, .xlsx, or .xls file.")

        # Clean column names
        df.columns = [str(c).strip() for c in df.columns]
        csv_str = df.to_csv(index=False)
        return {"stats": get_stats(df), "csv_data": csv_str, "filename": file.filename or "dataset.csv"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse dataset: {type(e).__name__}")

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
        raise HTTPException(status_code=500, detail=f"Cleaning failed: {type(e).__name__}")

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
        raise HTTPException(status_code=500, detail=f"Outlier treatment failed: {type(e).__name__}")

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
        raise HTTPException(status_code=500, detail=f"EDA calculation failed: {type(e).__name__}")

@app.post("/api/train")
async def train_models(
    csv_data: str = Form(...),
    target: str = Form(...),
    task_type: Optional[str] = Form(None)
):
    try:
        df = pd.read_csv(io.StringIO(csv_data))
        if target not in df.columns: 
            raise HTTPException(status_code=400, detail=f"Target column '{target}' not found in dataset")
        
        # Drop rows where target is missing
        df = df.dropna(subset=[target]).reset_index(drop=True)
        n_samples = len(df)
        if n_samples < 5:
            raise HTTPException(status_code=400, detail="Dataset requires at least 5 non-null rows for model evaluation.")
        
        y = df[target]
        X = df.drop(columns=[target])
        
        # 1. Preprocessing: Drop ID-like and high-cardinality text columns before one-hot encoding
        cols_to_drop = []
        for col in X.columns:
            col_lower = str(col).lower().strip()
            # ID patterns
            if re.search(r"(^id$|_id$|^name$|^first_name$|^last_name$|^email$|^phone$|^ssn$|^uuid$)", col_lower):
                cols_to_drop.append(col)
            # High cardinality ratio > 50% for non-numeric/text columns
            elif not pd.api.types.is_numeric_dtype(X[col]) and (X[col].nunique() / n_samples > 0.5):
                cols_to_drop.append(col)
                
        if cols_to_drop:
            X = X.drop(columns=cols_to_drop)
            
        # One-hot encode remaining categorical features
        X = pd.get_dummies(X, drop_first=True)
        # Impute missing feature values with column median, fallback to 0
        X = X.fillna(X.median(numeric_only=True)).fillna(0)
        
        if X.empty or X.shape[1] == 0:
            raise HTTPException(status_code=400, detail="No valid feature columns remain after removing ID/high-cardinality columns.")
            
        # 2. Determine Task Type (Auto-detect or user specified)
        if task_type and task_type in ["Regression", "Classification"]:
            resolved_task_type = task_type
        else:
            # Auto-detect rule: float dtype or unique ratio > 5% -> Regression, else Classification
            unique_ratio = y.nunique() / n_samples
            if pd.api.types.is_float_dtype(y) or (unique_ratio > 0.05 and pd.api.types.is_numeric_dtype(y)) or (pd.api.types.is_numeric_dtype(y) and y.nunique() > 10):
                resolved_task_type = "Regression"
            else:
                resolved_task_type = "Classification"
                
        leaderboard = []
        
        # 3. 5-Fold Cross-Validation Model Training (reporting true mean scores)
        if resolved_task_type == "Classification":
            # For classification, encode string target if needed
            if not pd.api.types.is_numeric_dtype(y):
                y = pd.Categorical(y).codes
                
            min_class_count = pd.Series(y).value_counts().min()
            k = max(2, min(5, n_samples, min_class_count))
            
            if min_class_count >= 2 and k >= 2:
                cv = StratifiedKFold(n_splits=k, shuffle=True, random_state=42)
            else:
                cv = KFold(n_splits=max(2, min(5, n_samples)), shuffle=True, random_state=42)
                
            models = {
                "Random Forest Classifier": RandomForestClassifier(n_estimators=50, max_depth=6, random_state=42),
                "Decision Tree Classifier": DecisionTreeClassifier(max_depth=5, random_state=42),
                "Logistic Regression": LogisticRegression(max_iter=500)
            }
            
            for name, model in models.items():
                try:
                    scores = cross_val_score(model, X, y, cv=cv, scoring="accuracy")
                    mean_score = float(np.mean(scores))
                    leaderboard.append({
                        "model": name,
                        "metric": "Accuracy (5-Fold CV)",
                        "score": f"{round(mean_score * 100, 1)}%",
                        "raw_score": mean_score
                    })
                except Exception:
                    pass
        else:
            k = max(2, min(5, n_samples))
            cv = KFold(n_splits=k, shuffle=True, random_state=42)
            
            models = {
                "Random Forest Regressor": RandomForestRegressor(n_estimators=50, max_depth=6, random_state=42),
                "Decision Tree Regressor": DecisionTreeRegressor(max_depth=5, random_state=42),
                "Linear Regression": LinearRegression()
            }
            
            for name, model in models.items():
                try:
                    scores = cross_val_score(model, X, y, cv=cv, scoring="r2")
                    mean_score = float(np.mean(scores))
                    # Preserve real values without max(0, ...) clamping
                    leaderboard.append({
                        "model": name,
                        "metric": "R² Score (5-Fold CV)",
                        "score": f"{round(mean_score, 4)}",
                        "raw_score": mean_score
                    })
                except Exception:
                    pass
                    
        # Sort leaderboard descending by raw score
        leaderboard.sort(key=lambda x: x.get("raw_score", -999.0), reverse=True)
        clean_leaderboard = [{"model": m["model"], "metric": m["metric"], "score": m["score"]} for m in leaderboard]
        
        return {
            "task_type": resolved_task_type,
            "leaderboard": clean_leaderboard,
            "folds": k,
            "features_used": X.columns.tolist()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model training error: {type(e).__name__}")

@app.post("/api/chat")
async def grounded_chat(csv_data: str = Form(...), message: str = Form(...)):
    """
    Grounded conversational data intelligence analyzing active memory dataset.
    """
    try:
        df = pd.read_csv(io.StringIO(csv_data))
        msg_lower = message.lower()
        stats_info = get_stats(df)
        
        if "average" in msg_lower or "mean" in msg_lower:
            num_cols = stats_info["numeric_cols"]
            if num_cols:
                means = [f"• **{col}**: `{df[col].mean():.2f}`" for col in num_cols[:8]]
                reply = f"**Column Averages (Means):**\n\n" + "\n".join(means)
            else:
                reply = "There are no numerical columns in this dataset to compute averages."
        elif "missing" in msg_lower or "null" in msg_lower:
            missing_total = stats_info["missing_cells"]
            if missing_total == 0:
                reply = "✅ **Zero missing values!** Your dataset has complete data coverage across all rows and columns."
            else:
                col_missing = df.isna().sum()
                cols_with_nulls = [f"• **{col}**: {cnt} missing values ({cnt/len(df)*100:.1f}%)" for col, cnt in col_missing.items() if cnt > 0]
                reply = f"⚠️ Found **{missing_total} total missing cells** ({stats_info['missing_pct']}%):\n\n" + "\n".join(cols_with_nulls) + "\n\n💡 *Tip: Use the Data Cleaning tab to impute with Mean or Median.*"
        elif "correlation" in msg_lower:
            num_cols = stats_info["numeric_cols"]
            if len(num_cols) >= 2:
                corr = df[num_cols].corr()
                unstacked = corr.unstack()
                pairs = []
                for (col1, col2), val in unstacked.items():
                    if col1 != col2 and not np.isnan(val):
                        pairs.append((col1, col2, val))
                pairs.sort(key=lambda x: abs(x[2]), reverse=True)
                top_pairs = pairs[::2][:5]
                reply = "**Strongest Feature Correlations:**\n\n" + "\n".join([f"• **{p[0]}** ↔ **{p[1]}**: `r = {p[2]:.2f}`" for p in top_pairs])
            else:
                reply = "Need at least 2 numerical columns to calculate correlation matrix."
        elif "health" in msg_lower or "score" in msg_lower:
            reply = f"**Dataset Health Score: {stats_info['score']}/100**\n\n• Rows: {stats_info['total_rows']:,}\n• Missing: {stats_info['missing_pct']}%\n• Duplicates: {stats_info['duplicate_pct']}%\n• PII Status: {'Clean' if not stats_info['privacy_flags'] else 'PII Detected'}"
        else:
            reply = (
                f"**Dataset Summary:**\n\n"
                f"• **Dimensions**: `{stats_info['total_rows']:,}` rows × `{len(stats_info['columns'])}` columns\n"
                f"• **Numerical Columns**: {', '.join(stats_info['numeric_cols'][:6]) if stats_info['numeric_cols'] else 'None'}\n"
                f"• **Categorical Columns**: {', '.join(stats_info['categorical_cols'][:6]) if stats_info['categorical_cols'] else 'None'}\n"
                f"• **Health Score**: `{stats_info['score']}/100`\n\n"
                f"Ask me about column distributions, correlations, outliers, or modeling recommendations!"
            )
            
        return {"reply": reply}
    except Exception as e:
        return {"reply": f"Analysis calculation error: {type(e).__name__}"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
