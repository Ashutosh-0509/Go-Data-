# Smart Data Analyst & AutoML Platform

A Python Streamlit web application for end-to-end data profiling, live data health scoring, statistical cleaning, anomaly/outlier treatment, and exploratory data analysis (EDA).

---

## Tech Stack

- **Streamlit (`1.37.1`)**: Interactive web UI and application framework.
- **pandas (`2.2.2`) & numpy (`1.26.4`)**: Data manipulation and high-performance numerical operations.
- **scipy (`1.13.1`)**: Statistical computing and Z-score outlier detection (`scipy.stats.zscore`).
- **plotly (`5.24.1`)**: Interactive, responsive charts and heatmaps (`plotly.express`).
- **openpyxl (`3.1.5`)**: Excel workbook reader and parser (`.xlsx`, `.xls`).

---

## Project Structure

```text
smart-data-analyst/
│
├── app.py              # Main Streamlit application
├── requirements.txt    # Pinned production dependencies
├── sample_data.csv     # Synthetic dataset with missing values, duplicates, and outliers
└── README.md           # Setup, architectural documentation, and usage guide
```

---

## Installation & Setup

### 1. Clone or Open the Project
Ensure you are in the project folder:
```powershell
cd "c:\Users\Prajwal\OneDrive\Desktop\smart Data Analyst"
```

### 2. (Optional) Create & Activate a Virtual Environment
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 3. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 4. Run the Streamlit Application
```powershell
streamlit run app.py
```
The application will automatically start and open in your default browser at `http://localhost:8501`.

---

## Application Architecture & Features

### 1. Sidebar & Live Data Health Score
- **File Uploader**: Ingest `.csv`, `.xlsx`, or `.xls` spreadsheets seamlessly.
- **Live Data Health Score (0–100)**: Evaluates dataset quality dynamically:
  $$\text{score} = 100 - (0.5 \times \text{missing\_percentage}) - (0.5 \times \text{duplicate\_percentage})$$
  - Clamped between $0$ and $100$, rounded to $1$ decimal place.
  - Displays instant health status (*Excellent*, *Moderate*, *Needs Cleaning*) alongside cell/row counts.
  - Updates live and shows delta improvements after data cleaning operations.
- **Reset to Raw Data**: One-click restoration of the working dataset back to the untouched raw dataset.

### 2. Tab 1: Upload & Preview
- Real-time row count, column count, numeric count, and categorical count metrics.
- Interactive table showing the first 20 rows of the dataset.
- Per-column statistical summary table detailing data type, missing value counts, missing percentages, and cardinality.

### 3. Tab 2: Cleaning
- **Missing-Value Imputation Strategies**:
  - `Mean`: Fills numeric columns with their column mean; non-numeric columns with column mode.
  - `Median`: Fills numeric columns with their column median; non-numeric columns with column mode.
  - `Mode`: Fills all columns with their most frequent value.
  - `Drop rows`: Removes any rows containing null/NaN values.
- **Duplicate Removal**: Removes identical duplicate rows.
- **Safe Session State**: Updating working data `st.session_state.df` leaves the original raw dataframe `st.session_state.df_raw` untouched.

### 4. Tab 3: Outliers
- **Target Selection**: Multiselect numeric columns (default: all numeric columns).
- **Detection Methods**:
  - `IQR`: Identifies values outside $[Q_1 - 1.5 \times \text{IQR}, Q_3 + 1.5 \times \text{IQR}]$.
  - `Z-score`: Identifies values where $|z| > 3$ computed via `scipy.stats.zscore`.
- **Handling Actions**:
  - `Cap values`: Winsorizes extreme outliers to upper and lower statistical thresholds.
  - `Remove rows`: Drops rows containing outliers in any of the selected columns.
  - `Flag only`: Appends boolean `{column}_outlier` columns without modifying raw values.

### 5. Tab 4: Exploratory Data Analysis (EDA)
- **Interactive Distribution Histogram**: Dynamic Plotly histogram with top marginal box plot and configurable binning.
- **Correlation Heatmap**: Auto-generated Plotly Pearson correlation matrix with inline annotations (`text_auto=True`) for all numeric columns.

---

## Roadmap

- **Phase 3**: Automated AutoML training baseline (classification & regression), feature importance, hyperparameter tuning.
- **Phase 4**: Explainable AI (SHAP / LIME), algorithmic fairness auditing, and natural language data chat assistant.
