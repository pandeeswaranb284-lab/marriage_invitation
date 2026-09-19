# ── Stage 1: Build the React frontend ───────────────────────────
FROM node:20-slim AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
# Point API calls to the same origin (no localhost)
RUN VITE_API_BASE=/api npm run build

# ── Stage 2: Python backend + serve static files ─────────────────
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ ./

# Copy built frontend into backend's static folder
COPY --from=frontend-build /app/frontend/dist ./static

# Make sure the DB directory is writable
RUN mkdir -p /data && chmod 777 /data

ENV PORT=8080
ENV DATABASE_URL=sqlite:////data/wedding_invite.db

EXPOSE 8080

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
