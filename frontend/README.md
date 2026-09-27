# Smart Data Analyst - Frontend

Modern, interactive Next.js web application for automated dataset analysis, interactive data cleaning, visual exploratory data analysis (EDA), automated machine learning (AutoML) benchmarking, and data agent chat.

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **UI & Styling**: Tailwind CSS v4, Google Fonts (Inter, Merriweather, Geist)
- **Language**: TypeScript / React 19

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open the browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

## 🔗 Backend Connectivity

By default, API requests to `/api/*` are dynamically proxied to the Python FastAPI backend running at `http://127.0.0.1:8000/api/*`.
To customize the backend endpoint, define `BACKEND_URL` in `.env.local`:
```env
BACKEND_URL=http://127.0.0.1:8000
```
