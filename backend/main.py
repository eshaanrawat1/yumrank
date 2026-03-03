from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import SessionLocal
from routers import category, restaurant

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(category.router)
app.include_router(restaurant.router)

@app.get("/")
async def main():
    return {"message": "Hello World"}