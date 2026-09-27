# Smart Data Analyst & AutoML Backend

High-performance FastAPI service providing data statistics, cleaning algorithms, outlier detection, exploratory data analysis (EDA), automated machine learning (AutoML), and conversational pandas grounding.

## 🚀 Features

- **Data Profiling**: Instant dataset health score, missing percentage, duplicates, and column type inference.
- **Privacy Detection**: Automatic regex-based detection of PII (Email addresses, phone numbers).
- **Data Cleaning**: Strategies for handling missing values (Mean, Median, Mode, Drop rows) and deduplication.
- **Outlier Engine**: Z-Score and IQR (Interquartile Range) methods with Cap or Remove actions.
- **EDA & Visuals**: Real-time histogram generation and Pearson correlation matrix.
- **AutoML Pipeline**: Automated model selection and evaluation for Classification (Logistic Regression, Decision Trees, Random Forests) and Regression (Linear Regression, Decision Trees, Random Forests).
- **Grounded Chat**: In-memory Pandas execution engine for question answering with mathematical precision.

## 📦 Installation & Setup

1. **Navigate to backend folder**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment (optional but recommended)**:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the API server**:
   ```bash
   python main.py
   # Or using uvicorn directly:
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

5. **Interactive Swagger Documentation**:
   Open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) in your browser.
