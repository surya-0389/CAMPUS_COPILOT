"""FastAPI Application Entry Point for Campus Copilot Question Bank."""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import question_bank
from app.seed_data import init_and_seed_db

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Campus Copilot Question Bank & Exam Prep API",
    description="University Previous Year Papers, Internal Tests, Assignments, Practice Mode, and AI Solutions",
    version="2.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Question Bank Router
app.include_router(question_bank.router)


@app.on_event("startup")
def startup_event():
    init_and_seed_db()


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Campus Copilot Question Bank & Exam Prep",
        "database": "sqlite_connected"
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
