# AI-Based Plant Disease Detection and Classification System

Custom CNN (trained from scratch) + FastAPI + React + SQLite.

## Structure
- `ai/` - dataset prep, CNN training, evaluation (trained in Google Colab)
- `backend/` - FastAPI server, inference, SQLite history
- `frontend/` - React + Vite web app
- `docs/` - proposal, methodology, testing, user manual

## Run backend
```
cd backend
py -3.11 -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Check: http://127.0.0.1:8000/api/health

## Run frontend
```
cd frontend
npm install
npm run dev
```
