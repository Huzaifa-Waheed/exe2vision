from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.init_db import init_db
from app.api import auth, scan, admin
import os

app = FastAPI(title="Exe2Vision API")

# CORS — add any frontend origins here (space-separated in ALLOWED_ORIGINS env var)
_raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
allowed_origins = [o.strip() for o in _raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "X-User-Email"],
)

# Register routers
app.include_router(auth.router)
app.include_router(scan.router)
app.include_router(admin.router)

@app.on_event("startup")
def startup():
    init_db()

@app.get("/")
def root():
    return {"status": "Database Connected"}
