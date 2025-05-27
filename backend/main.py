from fastapi import FastAPI
from routers import scheduling

app = FastAPI()
app.include_router(scheduling.router, prefix="/api")
