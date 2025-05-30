from fastapi import FastAPI
from routers import scheduling
from routers import sync
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scheduling.router, prefix="/api")
app.include_router(sync.router, prefix="/api")
