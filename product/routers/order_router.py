from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from models.order import Order
from models.product import Product
from userManageApi.security import get_current_user

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)

@router.post("/buy/{product_id}")
def buy_now(
    product_id: int,
    quantity: int = 1,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    total = float(product.sale_price) * quantity

    order = Order(
        user_id=current_user.user_id,
        product_id=product_id,
        quantity=quantity,
        total_price=total,
        status="Pending"
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    return {
        "message": "Order placed successfully",
        "order_id": order.id,
        "total_price": total,
        "status": order.status
    }

@router.get("/my-orders")
def get_my_orders(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    results = db.query(
        Order.id,
        Order.quantity,
        Order.total_price,
        Order.status,
        Order.created_at,
        Product.name,
        Product.image_url,
        Product.sale_price
    ).join(
        Product, Order.product_id == Product.id
    ).filter(
        Order.user_id == current_user.user_id
    ).all()

    return [
        {
            "order_id": r[0],
            "quantity": r[1],
            "total_price": str(r[2]),
            "status": r[3],
            "created_at": str(r[4]),
            "product_name": r[5],
            "image_url": r[6],
            "sale_price": str(r[7])
        }
        for r in results
    ]

@router.put("/update-status/{order_id}")
def update_order_status(
    order_id: int,
    status: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = status
    db.commit()

    return {
        "message": "Order status updated",
        "order_id": order_id,
        "status": order.status
    }

@router.get("/all-orders")
def get_all_orders(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    results = db.query(
        Order.id,
        Order.user_id,
        Order.quantity,
        Order.total_price,
        Order.status,
        Order.created_at,
        Product.name,
        Product.image_url,
        Product.sale_price
    ).join(
        Product, Order.product_id == Product.id
    ).all()

    return [
        {
            "order_id": r[0],
            "user_id": r[1],
            "quantity": r[2],
            "total_price": str(r[3]),
            "status": r[4],
            "created_at": str(r[5]),
            "product_name": r[6],
            "image_url": r[7],
            "sale_price": str(r[8])
        }
        for r in results
    ]