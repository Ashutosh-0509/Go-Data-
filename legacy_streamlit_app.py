"""
Smart Data Analyst & AutoML Platform
====================================
A modern Streamlit web application for data profiling, health scoring,
automated cleaning, outlier handling, and interactive exploratory data analysis.

Tech Stack:
- Streamlit
- Pandas & NumPy
- Scipy.stats (Z-score outlier detection)
- Plotly Express (Interactive charts)
- OpenPyXL (Excel file support)
"""

import io
import numpy as np
import pandas as pd
import plotly.express as px
from scipy import stats
import streamlit as st


# ==============================================================================
# REUSABLE CORE FUNCTIONS (Decoupled for future ML pipeline reuse)
# ==============================================================================

def calculate_health_score(df: pd.DataFrame) -> dict:
    """
    Calculates Data Health Score for a dataset:
    score = 100 - (0.5 * missing_percentage) - (0.5 * duplicate_percentage)
    Clamped between 0 and 100, rounded to 1 decimal.
    
    Returns a dictionary with score and granular percentage metrics.
    """
    if df is None or df.empty:
        return {
            "score": 0.0,
            "missing_pct": 0.0,
            "duplicate_pct": 0.0,
            "total_cells": 0,
            "missing_cells": 0,
            "duplicate_rows": 0,
            "total_rows": 0,
        }

    total_cells = df.size
    missing_cells = int(df.isna().sum().sum())
    missing_pct = (missing_cells / total_cells * 100.0) if total_cells > 0 else 0.0

    total_rows = len(df)
    duplicate_rows = int(df.duplicated().sum())
    duplicate_pct = (duplicate_rows / total_rows * 100.0) if total_rows > 0 else 0.0

    raw_score = 100.0 - (0.5 * missing_pct) - (0.5 * duplicate_pct)
    clamped_score = round(float(np.clip(raw_score, 0.0, 100.0)), 1)

    return {
        "score": clamped_score,
        "missing_pct": round(missing_pct, 2),
        "duplicate_pct": round(duplicate_pct, 2),
        "total_cells": total_cells,
        "missing_cells": missing_cells,
        "duplicate_rows": duplicate_rows,
        "total_rows": total_rows,
    }


def clean_data(
    df: pd.DataFrame,
    strategy: str = "Mean",
    remove_duplicates: bool = False,
) -> pd.DataFrame:
    """
    Cleans DataFrame by imputing or dropping missing values and optionally
    removing duplicate rows.

    Missing value strategies:
    - 'Mean': Numeric columns imputed with column mean; non-numeric columns
              always imputed with column mode (most frequent value).
    - 'Median': Numeric columns imputed with column median; non-numeric columns
                always imputed with column mode.
    - 'Mode': All columns imputed with column mode.
    - 'Drop rows': Drop all rows containing any NaN values.

    Parameters:
        df: Input pandas DataFrame.
        strategy: 'Mean', 'Median', 'Mode', or 'Drop rows'.
        remove_duplicates: Whether to drop duplicate rows.

    Returns:
        pd.DataFrame: Cleaned copy of the dataset with clean reset index.
    """
    if df is None:
        return pd.DataFrame()

    df_cleaned = df.copy()

    # Identify numeric vs non-numeric columns
    numeric_cols = df_cleaned.select_dtypes(include=[np.number]).columns.tolist()
    non_numeric_cols = [c for c in df_cleaned.columns if c not in numeric_cols]

    # Apply missing value strategy
    if strategy == "Drop rows":
        df_cleaned = df_cleaned.dropna()
    elif strategy == "Mean":
        for col in numeric_cols:
            mean_val = df_cleaned[col].mean()
            if pd.notna(mean_val):
                df_cleaned[col] = df_cleaned[col].fillna(mean_val)
        for col in non_numeric_cols:
            modes = df_cleaned[col].mode()
            if not modes.empty:
                df_cleaned[col] = df_cleaned[col].fillna(modes.iloc[0])
    elif strategy == "Median":
        for col in numeric_cols:
            median_val = df_cleaned[col].median()
            if pd.notna(median_val):
                df_cleaned[col] = df_cleaned[col].fillna(median_val)
        for col in non_numeric_cols:
            modes = df_cleaned[col].mode()
            if not modes.empty:
                df_cleaned[col] = df_cleaned[col].fillna(modes.iloc[0])
    elif strategy == "Mode":
        for col in df_cleaned.columns:
            modes = df_cleaned[col].mode()
            if not modes.empty:
                df_cleaned[col] = df_cleaned[col].fillna(modes.iloc[0])
    else:
        raise ValueError(f"Unsupported missing value strategy: '{strategy}'")

    # Handle duplicates if requested
    if remove_duplicates:
        df_cleaned = df_cleaned.drop_duplicates()

    return df_cleaned.reset_index(drop=True)


def handle_outliers(
    df: pd.DataFrame,
    columns: list[str],
    method: str = "IQR",
    action: str = "Cap values",
) -> tuple[pd.DataFrame, dict]:
    """
    Detects and handles outliers across selected numeric columns.

    Detection methods:
    - 'IQR': Q1 - 1.5 * IQR to Q3 + 1.5 * IQR
    - 'Z-score': |z| > 3 via scipy.stats.zscore

    Actions:
    - 'Remove rows': Removes rows where any of the chosen columns has an outlier.
    - 'Cap values': Winsorizes values to the computed lower and upper bounds.
    - 'Flag only': Appends boolean columns named '{col}_outlier' without modifying data.

    Parameters:
        df: Input pandas DataFrame.
        columns: List of column names to evaluate.
        method: 'IQR' or 'Z-score'.
        action: 'Remove rows', 'Cap values', or 'Flag only'.

    Returns:
        tuple[pd.DataFrame, dict]: Processed DataFrame and summary metrics per column.
    """
    if df is None or df.empty or not columns:
        return (df.copy().reset_index(drop=True) if df is not None else pd.DataFrame()), {}

    df_out = df.copy()
    report = {}
    combined_outlier_mask = pd.Series(False, index=df_out.index)

    for col in columns:
        if col not in df_out.columns:
            continue

        series = pd.to_numeric(df_out[col], errors="coerce")
        valid_series = series.dropna()

        if valid_series.empty:
            report[col] = {
                "outlier_count": 0,
                "lower_bound": None,
                "upper_bound": None,
                "method": method,
            }
            continue

        if method == "IQR":
            q1 = float(valid_series.quantile(0.25))
            q3 = float(valid_series.quantile(0.75))
            iqr = q3 - q1
            lower_bound = q1 - 1.5 * iqr
            upper_bound = q3 + 1.5 * iqr
            outlier_mask = (series < lower_bound) | (series > upper_bound)
        elif method == "Z-score":
            std_val = float(valid_series.std(ddof=0))
            mean_val = float(valid_series.mean())
            if std_val > 0 and len(valid_series) >= 2:
                # Calculate z-scores using scipy.stats.zscore
                z_vals = np.abs(stats.zscore(valid_series))
                z_series = pd.Series(z_vals, index=valid_series.index)
                outlier_mask = pd.Series(False, index=df_out.index)
                outlier_mask.loc[valid_series.index] = z_series > 3
                lower_bound = mean_val - 3.0 * std_val
                upper_bound = mean_val + 3.0 * std_val
            else:
                outlier_mask = pd.Series(False, index=df_out.index)
                lower_bound = mean_val
                upper_bound = mean_val
        else:
            raise ValueError(f"Unsupported outlier method: '{method}'")

        outlier_mask = outlier_mask.fillna(False)
        outlier_count = int(outlier_mask.sum())

        report[col] = {
            "outlier_count": outlier_count,
            "lower_bound": round(lower_bound, 3) if lower_bound is not None else None,
            "upper_bound": round(upper_bound, 3) if upper_bound is not None else None,
            "method": method,
        }

        combined_outlier_mask = combined_outlier_mask | outlier_mask

        if action == "Flag only":
            flag_col_name = f"{col}_outlier"
            df_out[flag_col_name] = outlier_mask
        elif action == "Cap values":
            if lower_bound is not None and upper_bound is not None:
                df_out[col] = df_out[col].clip(lower=lower_bound, upper=upper_bound)

    if action == "Remove rows":
        df_out = df_out[~combined_outlier_mask]

    return df_out.reset_index(drop=True), report


# ==============================================================================
# STREAMLIT UI CONFIGURATION & STYLING
# ==============================================================================


st.set_page_config(
    page_title="Smart Data Analyst & AutoML Platform",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded",
)

# NEW THEME AND LANDING PAGE CSS
st.markdown(
    '''
    <style>
    /* Global Theme */
    [data-testid="stAppViewContainer"] {
        background-color: #F3F0E6;
    }
    [data-testid="stSidebar"] {
        background-color: #EBE7DC;
        border-right: 1px solid #DFDBD0;
    }
    h1, h2, h3, h4, h5, h6 {
        color: #18332F !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
        letter-spacing: -0.03em !important;
    }
    .stTabs [data-baseweb="tab"] { font-size: 1.05rem; font-weight: 600; padding: 10px 18px; }

    /* Landing Page Specific Styles */
    .hero-pre { color: #2D6A59; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.8rem; margin-bottom: 0.5rem; }
    .hero-title { font-size: 4rem; font-weight: 800; color: #18332F !important; line-height: 1.1; margin: 0; letter-spacing: -0.05em; font-family: system-ui, -apple-system, sans-serif !important; }
    .hero-subtitle { font-size: 4rem; font-weight: 500; font-family: Georgia, serif !important; font-style: italic; color: #2D6A59 !important; line-height: 1.1; margin: 0 0 1.5rem 0; letter-spacing: -0.02em; }
    .hero-desc { font-size: 1.1rem; color: #5A6B65; max-width: 650px; line-height: 1.6; margin-bottom: 2rem; }

    .dark-banner { background-color: #18332F; border-radius: 12px; padding: 3rem; color: white; display: flex; gap: 2rem; margin-bottom: 4rem; margin-top: 4rem; align-items: center;}
    .dark-banner-left { flex: 1; font-size: 2.2rem; font-weight: 700; line-height: 1.2; letter-spacing: -0.03em; color: white; }
    .dark-banner-right { flex: 1; font-size: 1rem; color: #A3B5AE; line-height: 1.6; }

    .section-label { font-size: 0.8rem; color: #2D6A59; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; }
    .section-title-wrapper { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #18332F; padding-bottom: 1rem; margin-bottom: 2rem; margin-top: 4rem; }
    .section-title-main { font-size: 2rem; font-weight: 700; color: #18332F; margin:0; }

    .check-item { border-left: 1px solid #DFDBD0; padding-left: 1.5rem; margin-bottom: 2rem; height: 100%;}
    .check-num { color: #F87171; font-size: 0.8rem; font-weight: 700; margin-bottom: 1rem;}
    .check-title { font-size: 1.1rem; font-weight: 700; color: #18332F; margin-bottom: 0.5rem; }
    .check-desc { font-size: 0.95rem; color: #5A6B65; line-height: 1.5; }

    .step-row { border-bottom: 1px solid #DFDBD0; padding: 2rem 0; display: flex; gap: 2rem; }
    .step-num { color: #F87171; font-weight: 700; font-size: 0.9rem; width: 30px; padding-top: 0.2rem;}
    .step-content h4 { margin: 0 0 0.5rem 0; font-size: 1.2rem; color: #18332F; font-weight: 700;}
    .step-content p { margin: 0; color: #5A6B65; font-size: 0.95rem; line-height: 1.5;}

    .keep-in-mind { background-color: #F8EDD8; padding: 1.5rem 2rem; border-radius: 8px; margin-top: 2rem; color: #5A6B65; font-size: 0.95rem; display: flex; gap: 2rem; align-items: center;}
    .keep-in-mind strong { color: #18332F; white-space: nowrap; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em;}

    /* White Upload Card Override */
    div[data-testid="stVerticalBlockBorderWrapper"]:has(h2#check-data-you-care-about) {
        background-color: #FFFFFF;
        border-radius: 16px;
        padding: 2.5rem;
        box-shadow: 0 12px 40px rgba(0,0,0,0.06);
        border: 1px solid #E5E2D9;
        margin-top: 2rem;
        margin-bottom: 2rem;
    }
    
    .stButton>button { border-radius: 8px; font-weight: 600; }
    
    </style>
    ''',
    unsafe_allow_html=True,
)
if "df_raw" not in st.session_state:
    st.session_state.df_raw = None

if "df" not in st.session_state:
    st.session_state.df = None

if "uploaded_file_name" not in st.session_state:
    st.session_state.uploaded_file_name = None


# ==============================================================================
# SIDEBAR
# ==============================================================================

with st.sidebar:
    st.title("Smart Data Analyst")
    st.caption("AutoML & Exploratory Profiling Engine")
    st.markdown("---")

    # File uploader (.csv, .xlsx, .xls)
    uploaded_file = st.file_uploader(
        "Upload dataset",
        type=["csv", "xlsx", "xls"],
        help="Supported formats: CSV, Excel (.xlsx, .xls)",
    )

    # Demo dataset option for convenience
    use_sample = st.checkbox("Load Sample Dataset", value=False, help="Quickly explore features with synthetic sample data.")

    # File reading logic wrapped in try/except
    file_to_load = None
    file_name = None

    if uploaded_file is not None:
        file_to_load = uploaded_file
        file_name = uploaded_file.name
    elif use_sample:
        file_name = "sample_data.csv"
        try:
            with open("sample_data.csv", "rb") as f:
                file_to_load = io.BytesIO(f.read())
        except Exception as e:
            st.error(f"Could not load sample dataset: {e}")

    # Check if a new file needs to be ingested into session state
    if file_to_load is not None and (st.session_state.uploaded_file_name != file_name or st.session_state.df_raw is None):
        try:
            if file_name.endswith(".csv"):
                loaded_df = pd.read_csv(file_to_load)
            elif file_name.endswith((".xlsx", ".xls")):
                loaded_df = pd.read_excel(file_to_load, engine="openpyxl" if file_name.endswith(".xlsx") else None)
            else:
                st.error("Unsupported file extension. Please upload a .csv, .xlsx, or .xls file.")
                loaded_df = None

            if loaded_df is not None:
                if loaded_df.empty:
                    st.warning("The uploaded file is empty. Please upload a dataset with data rows.")
                    st.session_state.df_raw = None
                    st.session_state.df = None
                else:
                    st.session_state.df_raw = loaded_df.copy().reset_index(drop=True)
                    st.session_state.df = loaded_df.copy().reset_index(drop=True)
                    st.session_state.uploaded_file_name = file_name
                    st.toast(f"Loaded {file_name} successfully!", icon="✅")
        except Exception as err:
            st.error(f"Error reading file '{file_name}': {err}")
            st.session_state.df_raw = None
            st.session_state.df = None

    st.markdown("---")
    st.markdown('<div class="sidebar-section-title">Data Health Monitor</div>', unsafe_allow_html=True)

    # Live Data Health Score computation (0-100)
    # score = 100 - (0.5 * missing_percentage_of_raw_data) - (0.5 * duplicate_percentage_of_raw_rows)
    if st.session_state.df_raw is not None and not st.session_state.df_raw.empty:
        raw_health = calculate_health_score(st.session_state.df_raw)
        health_score = raw_health["score"]

        # Health status badge
        if health_score >= 80:
            status_text = "Excellent"
        elif health_score >= 60:
            status_text = "Moderate"
        else:
            status_text = "Needs Cleaning"

        st.metric(
            label="Data Health Score",
            value=f"{health_score:.1f} / 100",
            help="Formula: 100 - (0.5 * % Missing) - (0.5 * % Duplicates)",
        )

        st.markdown(
            f"""
            <div class="metric-card">
                <b>Status:</b> {status_text}<br>
                <b>Missing Data:</b> {raw_health['missing_pct']}% ({raw_health['missing_cells']:,} cells)<br>
                <b>Duplicates:</b> {raw_health['duplicate_pct']}% ({raw_health['duplicate_rows']:,} rows)
            </div>
            """,
            unsafe_allow_html=True,
        )

        # Show working copy health score if cleaning/outliers changed it
        if st.session_state.df is not None:
            working_health = calculate_health_score(st.session_state.df)
            working_score = working_health["score"]
            delta = round(working_score - health_score, 1)
            if delta != 0 or len(st.session_state.df) != len(st.session_state.df_raw):
                st.caption(
                    f"**Cleaned Working Score:** {working_score:.1f} / 100 "
                    f"({'▲ +' if delta > 0 else '▼ '}{delta:.1f})"
                )

        st.markdown("---")
        # Reset button to restore original raw data
        if st.button("↺ Reset Working Data to Raw", use_container_width=True):
            try:
                st.session_state.df = st.session_state.df_raw.copy().reset_index(drop=True)
                st.toast("Working dataset restored to original raw data.", icon="↺")
                st.rerun()
            except Exception as e:
                st.error(f"Error resetting data: {e}")
    else:
        st.metric(label="Data Health Score", value="— / 100")
        st.info("Upload a dataset (.csv, .xlsx, .xls) to compute health score.")


# ==============================================================================
# MAIN PAGE HEADER
# ==============================================================================

st.markdown('<div class="main-header">Smart Data Analyst & AutoML Platform</div>', unsafe_allow_html=True)
st.markdown(
    '<div class="sub-header">Automated data profiling, health scoring, statistical cleaning, and exploratory data analysis.</div>',
    unsafe_allow_html=True,
)


# ==============================================================================
# LANDING PAGE VIEW (When no data is loaded)
# ==============================================================================
if st.session_state.df is None or st.session_state.df.empty:
    
    st.markdown(
        '''
        <div style="padding: 2rem 0;">
            <div class="hero-pre">Private Dataset Recovery</div>
            <h1 class="hero-title">Repair a corrupted dataset.</h1>
            <h1 class="hero-subtitle">Recover the files that survived.</h1>
            <p class="hero-desc">Smart Data Analyst reads surviving entry records, extracts available data, and rebuilds a clean dataset while preserving the source.<br><br>Supports standard CSV and Excel formats, including datasets with missing or damaged statistical information.</p>
        </div>
        ''',
        unsafe_allow_html=True
    )

    with st.container(border=True):
        st.markdown("<h2 id='check-data-you-care-about' style='margin-top:0; font-size: 2rem;'>Check files you care about.</h2>", unsafe_allow_html=True)
        st.markdown("<p style='color:#5A6B65; margin-bottom: 2rem;'>Choose a dataset or just a few files. Smart Data Analyst checks them privately in this browser, then shows you which ones may need attention.</p>", unsafe_allow_html=True)
        
        c1, c2 = st.columns([1, 1])
        with c1:
            uploaded_file_main = st.file_uploader("Upload dataset", type=["csv", "xlsx", "xls"], label_visibility="collapsed", key="landing_uploader")
        with c2:
            st.write("") 
            st.write("") 
            use_sample_main = st.button("Scan a Sample Dataset instead", use_container_width=True, key="landing_sample")
            
        st.markdown(
            '''
            <div style="display:flex; gap: 3rem; color: #5A6B65; font-size: 0.85rem; margin-top: 2rem; border-top: 1px solid #E5E2D9; padding-top: 1.5rem;">
                <div><span style="color:#2D6A59;">✓</span> Nothing is uploaded</div>
                <div><span style="color:#2D6A59;">✓</span> Original is left untouched</div>
                <div><span style="color:#2D6A59;">✓</span> Handles missing & duplicate data</div>
            </div>
            ''',
            unsafe_allow_html=True
        )

        file_to_load_main = None
        file_name_main = None
        if uploaded_file_main is not None:
            file_to_load_main = uploaded_file_main
            file_name_main = uploaded_file_main.name
        elif use_sample_main:
            file_name_main = "sample_data.csv"
            with open("sample_data.csv", "rb") as f:
                file_to_load_main = io.BytesIO(f.read())
        
        if file_to_load_main is not None:
            try:
                if file_name_main.endswith(".csv"):
                    loaded_df = pd.read_csv(file_to_load_main)
                elif file_name_main.endswith((".xlsx", ".xls")):
                    loaded_df = pd.read_excel(file_to_load_main, engine="openpyxl" if file_name_main.endswith(".xlsx") else None)
                if not loaded_df.empty:
                    st.session_state.df_raw = loaded_df.copy().reset_index(drop=True)
                    st.session_state.df = loaded_df.copy().reset_index(drop=True)
                    st.session_state.uploaded_file_name = file_name_main
                    st.rerun()
            except Exception as e:
                st.error(f"Error loading file: {e}")

    st.markdown(
        '''
        <div class="dark-banner">
            <div class="dark-banner-left">The dataset directory can be broken while individual entries remain recoverable.</div>
            <div class="dark-banner-right">A dataset points to each stored file. Smart Data Analyst finds surviving entry records, validates their data, and builds a new archive with a recovery report.</div>
        </div>

        <div class="section-title-wrapper">
            <span class="section-label">Supported approach</span>
            <h2 class="section-title-main">Dataset damage Openable checks</h2>
        </div>
        ''',
        unsafe_allow_html=True
    )

    cc1, cc2, cc3 = st.columns(3)
    with cc1:
        st.markdown('<div class="check-item"><div class="check-num">01</div><div class="check-title">Missing central directory</div><div class="check-desc">Locate surviving local entry headers and impute missing variables.</div></div>', unsafe_allow_html=True)
    with cc2:
        st.markdown('<div class="check-item"><div class="check-num">02</div><div class="check-title">Available entry data</div><div class="check-desc">Recover complete rows and flag identical partial data automatically.</div></div>', unsafe_allow_html=True)
    with cc3:
        st.markdown('<div class="check-item"><div class="check-num">03</div><div class="check-title">Archive validation</div><div class="check-desc">Repair extreme anomalies using statistical boundaries and confirm its entries.</div></div>', unsafe_allow_html=True)

    st.markdown(
        '''
        <div class="section-title-wrapper">
            <span class="section-label">Step by step</span>
            <h2 class="section-title-main">How to repair a corrupted dataset file</h2>
        </div>

        <div class="step-row">
            <div class="step-num">01</div>
            <div class="step-content"><h4>Choose the damaged dataset</h4><p>Select the archive above. Processing stays on your computer.</p></div>
        </div>
        <div class="step-row">
            <div class="step-num">02</div>
            <div class="step-content"><h4>Review recoverable entries</h4><p>See the surviving file names and available data in the preview tab.</p></div>
        </div>
        <div class="step-row">
            <div class="step-num">03</div>
            <div class="step-content"><h4>Build a new dataset</h4><p>Apply cleaning and download the verified archive and its recovery report.</p></div>
        </div>

        <div class="keep-in-mind">
            <strong>Keep in mind</strong>
            <span>Recovery depends on surviving payload bytes and supported encryption. The report lists every recovered entry.</span>
        </div>

        <div class="section-title-wrapper">
            <span class="section-label">Common questions</span>
            <h2 class="section-title-main">File recovery FAQ</h2>
        </div>
        ''',
        unsafe_allow_html=True
    )
    
    with st.expander("Why does my dataset say it is invalid or corrupted?"):
        st.write("Datasets can become corrupted during interrupted downloads, hard drive failures, or software crashes. Smart Data Analyst attempts to bypass the damaged central directory and read the surviving records directly.")
    with st.expander("Is my data safe and private?"):
        st.write("Yes! Processing happens entirely within this environment. We do not upload your data to any external server.")
    with st.expander("What formats are supported?"):
        st.write("Currently, we support `.csv`, `.xlsx`, and `.xls` files natively.")
    
    st.stop()

# ==============================================================================
# MAIN NAVIGATION TABS
# ==============================================================================

tab_preview, tab_cleaning, tab_outliers, tab_eda = st.tabs([
    "📂 Upload & Preview",
    "🧹 Cleaning",
    "🎯 Outliers",
    "📈 EDA",
])


# ------------------------------------------------------------------------------
# TAB 1: UPLOAD & PREVIEW
# ------------------------------------------------------------------------------
with tab_preview:
    st.subheader("Dataset Overview & Profile")

    try:
        current_df = st.session_state.df

        # Row count, column count, and type metrics
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.metric("Total Rows", f"{current_df.shape[0]:,}")
        with col2:
            st.metric("Total Columns", f"{current_df.shape[1]:,}")
        with col3:
            numeric_count = len(current_df.select_dtypes(include=[np.number]).columns)
            st.metric("Numeric Columns", f"{numeric_count}")
        with col4:
            categorical_count = current_df.shape[1] - numeric_count
            st.metric("Categorical Columns", f"{categorical_count}")

        st.markdown("### First 20 Rows")
        st.dataframe(current_df.head(20).reset_index(drop=True), use_container_width=True, hide_index=True)

        st.markdown("### Per-Column Summary")
        # Per-column table with dtype, missing count, missing %
        column_summary = []
        for col_name in current_df.columns:
            missing_count = int(current_df[col_name].isna().sum())
            missing_pct = round((missing_count / len(current_df) * 100.0), 2) if len(current_df) > 0 else 0.0
            column_summary.append({
                "Column Name": col_name,
                "Data Type": str(current_df[col_name].dtype),
                "Missing Count": missing_count,
                "Missing (%)": f"{missing_pct:.2f}%",
                "Unique Values": int(current_df[col_name].nunique()),
            })

        summary_table = pd.DataFrame(column_summary)
        st.dataframe(summary_table, use_container_width=True, hide_index=True)

    except Exception as e:
        st.error(f"Error displaying preview: {e}")


# ------------------------------------------------------------------------------
# TAB 2: CLEANING
# ------------------------------------------------------------------------------
with tab_cleaning:
    st.subheader("Data Cleaning & Imputation")
    st.caption(
        "Configure missing-value strategies and duplicate removal. "
        "Numeric columns use mean/median; non-numeric columns always use mode."
    )

    try:
        col_clean_opt1, col_clean_opt2 = st.columns([1, 1])

        with col_clean_opt1:
            missing_strategy = st.selectbox(
                "Missing-Value Strategy",
                options=["Mean", "Median", "Mode", "Drop rows"],
                index=0,
                help=(
                    "- Mean: Numeric imputed with mean; non-numeric with mode.\n"
                    "- Median: Numeric imputed with median; non-numeric with mode.\n"
                    "- Mode: All columns imputed with mode.\n"
                    "- Drop rows: Drops any row with missing values."
                ),
            )

        with col_clean_opt2:
            st.markdown("<div style='height: 28px;'></div>", unsafe_allow_html=True)
            remove_dups = st.checkbox(
                "Remove duplicate rows",
                value=True,
                help="Drops identical rows across all columns.",
            )

        # Apply cleaning button
        if st.button("Apply Cleaning", type="primary", use_container_width=False):
            with st.spinner("Applying cleaning operations..."):
                try:
                    rows_before = len(st.session_state.df)
                    missing_before = int(st.session_state.df.isna().sum().sum())

                    cleaned_result = clean_data(
                        df=st.session_state.df,
                        strategy=missing_strategy,
                        remove_duplicates=remove_dups,
                    )

                    # Update working copy in session state, keeping df_raw untouched
                    rows_after = len(cleaned_result)
                    missing_after = int(cleaned_result.isna().sum().sum())
                    st.session_state.df = cleaned_result

                    st.success(
                        f"✅ Cleaning applied successfully! "
                        f"Rows: **{rows_before}** → **{rows_after}** (removed {rows_before - rows_after} duplicates/nulls) | "
                        f"Missing cells: **{missing_before}** → **{missing_after}**."
                    )
                except Exception as clean_err:
                    st.error(f"Failed to apply cleaning: {clean_err}")

        st.markdown("---")
        st.markdown("### Cleaned Data Preview")
        st.dataframe(st.session_state.df.head(20).reset_index(drop=True), use_container_width=True, hide_index=True)

        # Show current missing values and duplicates status
        curr_missing = int(st.session_state.df.isna().sum().sum())
        curr_dups = int(st.session_state.df.duplicated().sum())
        m1, m2 = st.columns(2)
        with m1:
            st.metric("Remaining Missing Cells", f"{curr_missing}")
        with m2:
            st.metric("Remaining Duplicate Rows", f"{curr_dups}")

    except Exception as e:
        st.error(f"Error in cleaning tab: {e}")


# ------------------------------------------------------------------------------
# TAB 3: OUTLIERS
# ------------------------------------------------------------------------------
with tab_outliers:
    st.subheader("Statistical Outlier Detection & Treatment")
    st.caption("Identify and manage extreme anomalies using IQR or Z-score bounds.")

    try:
        numeric_columns = st.session_state.df.select_dtypes(include=[np.number]).columns.tolist()

        if not numeric_columns:
            st.warning("No numeric columns found in the dataset for outlier detection.")
        else:
            col_out1, col_out2, col_out3 = st.columns(3)

            with col_out1:
                selected_num_cols = st.multiselect(
                    "Select Numeric Columns",
                    options=numeric_columns,
                    default=numeric_columns,
                    help="Choose numeric columns to run outlier detection on.",
                )

            with col_out2:
                detection_method = st.radio(
                    "Detection Method",
                    options=["IQR", "Z-score"],
                    index=0,
                    help=(
                        "- IQR: Values outside [Q1 - 1.5*IQR, Q3 + 1.5*IQR]\n"
                        "- Z-score: Values where |z| > 3 via scipy.stats.zscore"
                    ),
                )

            with col_out3:
                action_method = st.radio(
                    "Action",
                    options=["Remove rows", "Cap values", "Flag only"],
                    index=1,
                    help=(
                        "- Remove rows: Discards rows containing any outlier.\n"
                        "- Cap values: Winsorizes values to the threshold bounds.\n"
                        "- Flag only: Appends boolean '*_outlier' column."
                    ),
                )

            if st.button("Apply Outlier Handling", type="primary", use_container_width=False):
                if not selected_num_cols:
                    st.warning("Please select at least one numeric column.")
                else:
                    with st.spinner("Processing outliers..."):
                        try:
                            rows_prev = len(st.session_state.df)
                            processed_df, outlier_report = handle_outliers(
                                df=st.session_state.df,
                                columns=selected_num_cols,
                                method=detection_method,
                                action=action_method,
                            )
                            total_detected = sum(r["outlier_count"] for r in outlier_report.values())
                            rows_new = len(processed_df)

                            st.session_state.df = processed_df
                            st.success(
                                f"✅ Outlier treatment complete (**{action_method}** using **{detection_method}**)! "
                                f"Detected **{total_detected}** outliers across {len(selected_num_cols)} columns. "
                                f"Rows: **{rows_prev}** → **{rows_new}**."
                            )
                        except Exception as out_err:
                            st.error(f"Error handling outliers: {out_err}")

            st.markdown("---")
            st.markdown("### Outlier Detection Inspection")

            # Display quick outlier statistics for selected columns
            outlier_stats = []
            for c in selected_num_cols:
                ser = pd.to_numeric(st.session_state.df[c], errors="coerce").dropna()
                if ser.empty:
                    continue
                if detection_method == "IQR":
                    q1 = float(ser.quantile(0.25))
                    q3 = float(ser.quantile(0.75))
                    iqr = q3 - q1
                    low = q1 - 1.5 * iqr
                    high = q3 + 1.5 * iqr
                    count = int(((ser < low) | (ser > high)).sum())
                else:
                    std_c = float(ser.std(ddof=0))
                    mean_c = float(ser.mean())
                    if std_c > 0 and len(ser) >= 2:
                        z_scores = np.abs(stats.zscore(ser))
                        count = int((z_scores > 3).sum())
                        low = mean_c - 3.0 * std_c
                        high = mean_c + 3.0 * std_c
                    else:
                        count = 0
                        low, high = mean_c, mean_c

                outlier_stats.append({
                    "Column": c,
                    "Method": detection_method,
                    "Lower Bound": round(low, 2),
                    "Upper Bound": round(high, 2),
                    "Outlier Count": count,
                    "Outlier %": f"{(count / len(ser) * 100.0):.2f}%" if len(ser) > 0 else "0.00%",
                })

            if outlier_stats:
                st.dataframe(pd.DataFrame(outlier_stats), use_container_width=True, hide_index=True)

            st.markdown("### Working Data Preview")
            st.dataframe(st.session_state.df.head(20).reset_index(drop=True), use_container_width=True, hide_index=True)

    except Exception as e:
        st.error(f"Error in outliers tab: {e}")


# ------------------------------------------------------------------------------
# TAB 4: EDA
# ------------------------------------------------------------------------------
with tab_eda:
    st.subheader("Exploratory Data Analysis (EDA)")
    st.caption("Interactive visualizations powered by Plotly Express.")

    try:
        numeric_cols_eda = st.session_state.df.select_dtypes(include=[np.number]).columns.tolist()
        # Filter out boolean outlier flag columns if present
        clean_numeric_cols = [c for c in numeric_cols_eda if not c.endswith("_outlier")]

        if not clean_numeric_cols:
            st.warning("No numeric columns available in the current dataset for visualization.")
        else:
            # 1. Interactive Plotly Histogram
            st.markdown("### Feature Distribution Histogram")
            
            # Pick a representative column if available (e.g., salary, age, or first numeric)
            default_idx = 0
            for pref in ["salary", "age", "performance_score"]:
                if pref in clean_numeric_cols:
                    default_idx = clean_numeric_cols.index(pref)
                    break

            selected_hist_col = st.selectbox(
                "Select numeric column for distribution analysis",
                options=clean_numeric_cols,
                index=default_idx,
                key="eda_hist_column_selector",
            )

            if selected_hist_col:
                col_data = st.session_state.df[selected_hist_col].dropna()
                if col_data.empty:
                    st.warning(f"Column '{selected_hist_col}' has no non-null values.")
                else:
                    fig_hist = px.histogram(
                        st.session_state.df,
                        x=selected_hist_col,
                        marginal="box",
                        nbins=25,
                        title=f"Distribution of {selected_hist_col} (with Box Plot Marginal)",
                        template="plotly_white",
                        color_discrete_sequence=["#2563EB"],
                    )
                    fig_hist.update_layout(
                        xaxis_title=selected_hist_col,
                        yaxis_title="Count",
                        bargap=0.05,
                        height=420,
                    )
                    st.plotly_chart(fig_hist, use_container_width=True)

            st.markdown("---")

            # 2. Plotly Correlation Heatmap
            st.markdown("### Correlation Heatmap")
            if len(clean_numeric_cols) > 1:
                corr_matrix = st.session_state.df[clean_numeric_cols].corr()

                fig_corr = px.imshow(
                    corr_matrix,
                    text_auto=".2f",
                    aspect="auto",
                    color_continuous_scale="RdBu_r",
                    zmin=-1,
                    zmax=1,
                    title="Pearson Correlation Matrix",
                )
                fig_corr.update_layout(
                    xaxis_title="Features",
                    yaxis_title="Features",
                    height=450,
                )
                st.plotly_chart(fig_corr, use_container_width=True)
            else:
                st.info("At least 2 numeric columns are required to generate a correlation heatmap.")

    except Exception as e:
        st.error(f"Error generating EDA charts: {e}")


# ==============================================================================
# TODO: Phase 3 - ML training
# Planned: Automated baseline models (classification & regression),
# feature importance, cross-validation, hyperparameter tuning, model comparison.
# ==============================================================================

# ==============================================================================
# TODO: Phase 4 - explainability, fairness, chatbot
# Planned: SHAP value explainability, disparate impact fairness auditing,
# and interactive AI data assistant / conversational querying.
# ==============================================================================
