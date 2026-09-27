# 📊 Smart Data Analyst & AutoML Platform

A full-stack, enterprise-grade data intelligence platform featuring automated data cleaning, real-time dataset profiling, exploratory data analysis (EDA), automated machine learning (AutoML), and conversational data querying.

---

## 📁 Repository Structure

```text
smart-data-analyst/
│
├── frontend/                     # Next.js 16 Web Application (App Router)
│   ├── app/                      # UI pages, layouts, and styles
│   │   ├── layout.tsx            # Global layout with typography & metadata
│   │   ├── page.tsx              # Main dashboard interface
│   │   ├── globals.css           # Tailwind CSS styles
│   │   └── favicon.ico
│   ├── public/                   # Static icons and assets
│   ├── next.config.mjs           # Next.js configuration & API rewrites proxy
│   ├── package.json              # NPM dependencies & scripts
│   ├── tsconfig.json             # TypeScript configuration
│   └── README.md                 # Frontend documentation
│
├── backend/                      # Python FastAPI Service
│   ├── main.py                   # FastAPI server, ML pipelines & data endpoints
│   ├── requirements.txt          # Python dependencies
│   ├── sample_data.csv           # Benchmark employee dataset
│   ├── legacy/                   # Archived Streamlit prototypes
│   │   ├── legacy_streamlit_app.py
│   │   └── rewrite.py
│   └── README.md                 # Backend documentation
│
├── sample_data.csv               # Reference sample dataset
├── viva_pitch.md                 # Presentation notes & evaluation guide
└── README.md                     # Master project documentation
```

---

## 🚀 Quick Start Guide

### 1. Start the Backend (FastAPI)

In a terminal, navigate to the `backend` folder and start the API:

```bash
cd backend
pip install -r requirements.txt
python main.py
```
*API runs at:* **`http://127.0.0.1:8000`**  
*Interactive Swagger docs:* **`http://127.0.0.1:8000/docs`**

---

### 2. Start the Frontend (Next.js)

In a separate terminal, navigate to the `frontend` folder and start the development server:

```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at:* **`http://localhost:3000`**

---

## ⚡ Core Features

1. **Dataset Health & Profiling**:
   - Calculates real-time Health Scores based on missingness and duplication.
   - Automatic PII/privacy scanning (Email addresses, Phone numbers).
2. **Interactive Data Cleaning**:
   - Imputation strategies: Drop rows, Mean, Median, Mode.
   - Deduplication.
3. **Outlier Detection & Capping**:
   - Z-score and Interquartile Range (IQR) outlier detection with Remove or Cap operations.
4. **Exploratory Data Analysis (EDA)**:
   - Dynamic distribution histograms and Pearson correlation matrix.
5. **AutoML Leaderboard**:
   - Automatic classification and regression benchmarking using Decision Trees, Random Forests, and Linear/Logistic models.
6. **Live Data Chat Agent**:
   - Deterministic, code-grounded pandas queries directly evaluated against the live dataset.
