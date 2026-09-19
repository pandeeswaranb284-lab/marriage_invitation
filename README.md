# Marriage Invitation

A full-stack wedding invitation application with a React + Vite + Tailwind frontend and a FastAPI backend.

## Project structure

- `frontend/` – React app for the invitation UI
- `backend/` – FastAPI application for APIs and file handling

## Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: FastAPI, Uvicorn, Pydantic

## Getting started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Notes

This scaffold is ready for building RSVP flows, gallery management, and invitation details.
