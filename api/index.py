from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
import io
import json
from scipy import stats
import base64

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
        "preview": preview
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
        stats_data = get_stats(df)
        
        return {"stats": stats_data, "csv_data": csv_str, "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
                mean_val = df[col].mean()
                if pd.notna(mean_val):
                    df[col] = df[col].fillna(mean_val)
            for col in non_numeric_cols:
                modes = df[col].mode()
                if not modes.empty:
                    df[col] = df[col].fillna(modes.iloc[0])
        elif strategy == "Median":
            for col in numeric_cols:
                median_val = df[col].median()
                if pd.notna(median_val):
                    df[col] = df[col].fillna(median_val)
            for col in non_numeric_cols:
                modes = df[col].mode()
                if not modes.empty:
                    df[col] = df[col].fillna(modes.iloc[0])
        elif strategy == "Mode":
            for col in df.columns:
                modes = df[col].mode()
                if not modes.empty:
                    df[col] = df[col].fillna(modes.iloc[0])
                    
        if remove_duplicates:
            df = df.drop_duplicates()
            
        df = df.reset_index(drop=True)
        stats_data = get_stats(df)
        csv_str = df.to_csv(index=False)
        
        return {"stats": stats_data, "csv_data": csv_str}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
        else: # IQR
            Q1 = df[numeric_cols].quantile(0.25)
            Q3 = df[numeric_cols].quantile(0.75)
            IQR = Q3 - Q1
            outliers = ((df[numeric_cols] < (Q1 - 1.5 * IQR)) | (df[numeric_cols] > (Q3 + 1.5 * IQR)))
            
        if action == "Remove":
            df = df[~outliers.any(axis=1)]
        elif action == "Cap":
            for col in numeric_cols:
                if method == "Z-score":
                    mean = df[col].mean()
                    std = df[col].std()
                    lower, upper = mean - 3*std, mean + 3*std
                else:
                    q1 = df[col].quantile(0.25)
                    q3 = df[col].quantile(0.75)
                    iqr = q3 - q1
                    lower, upper = q1 - 1.5*iqr, q3 + 1.5*iqr
                df[col] = np.clip(df[col], lower, upper)
                
        df = df.reset_index(drop=True)
        stats_data = get_stats(df)
        csv_str = df.to_csv(index=False)
        return {"stats": stats_data, "csv_data": csv_str}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/eda")
async def get_eda(csv_data: str = Form(...), column: str = Form(...)):
    try:
        df = pd.read_csv(io.StringIO(csv_data))
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        
        hist_data = []
        if column in numeric_cols:
            col_data = df[column].dropna()
            if not col_data.empty:
                counts, bins = np.histogram(col_data, bins=15)
                for i in range(len(counts)):
                    hist_data.append({"bin": f"{bins[i]:.1f}-{bins[i+1]:.1f}", "count": int(counts[i])})
                    
        corr_matrix = df[numeric_cols].corr().fillna(0).round(2).to_dict()
        return {"histogram": hist_data, "correlation": corr_matrix, "numeric_cols": numeric_cols}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
