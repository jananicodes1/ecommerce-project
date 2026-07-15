import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import Base, engine
from models.product import Product
from routers.product_router import router as product_router
from routers.order_router import router as order_router
from routers.cart_router import router as  cart_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
        "https://storied-rugelach-26cf17.netlify.app",
        "https://6a5645cb056d8ec84a563a01--storied-rugelach-26cf17.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(product_router)

app.include_router(order_router)

@app.get("/")
def home():
    return {
        "message": "Product API Running"
    }

app.include_router(cart_router)