import re, io

with open(r"c:\Users\Prajwal\OneDrive\Desktop\smart Data Analyst\app.py", "r", encoding="utf-8") as f:
    content = f.read()

css_injection = """
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
"""

idx_start = content.find("st.set_page_config(")
idx_session = content.find('if "df_raw" not in st.session_state:')

if idx_start == -1 or idx_session == -1:
    print("Could not find insertion points")
    exit(1)

new_content = content[:idx_start] + css_injection + content[idx_session:]

landing_page_logic = """
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
"""

idx_check_start = new_content.find("# Check if data is available")
idx_tabs_start = new_content.find("# ==============================================================================\n# MAIN NAVIGATION TABS")

if idx_check_start == -1 or idx_tabs_start == -1:
    print("Could not find second insertion points")
    exit(1)

new_content = new_content[:idx_check_start] + landing_page_logic + "\n" + new_content[idx_tabs_start:]

with open(r"c:\Users\Prajwal\OneDrive\Desktop\smart Data Analyst\app.py", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Updated app.py with landing page UI successfully.")
