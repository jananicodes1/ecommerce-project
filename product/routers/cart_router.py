from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from userManageApi.models.cart import Cart
from userManageApi.security import get_current_user
from db.database import get_db

router = APIRouter(
    prefix="/Cart",
    tags=["Cart"]
)

@router.post("/Add")
def add_to_cart(
    product_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    existing = db.query(Cart).filter(
        Cart.user_id == current_user.user_id,
        Cart.product_id == product_id
    ).first()

    if existing:
        existing.quantity += 1
        db.commit()
        return {
            "message": "Quantity updated",
            "product_id": product_id,
            "quantity": existing.quantity
        }

    cart_item = Cart(
        user_id=current_user.user_id,
        product_id=product_id
    )
    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)

    return {
        "message": "Product added to cart",
        "product_id": product_id,
        "user_id": current_user.user_id
    }

@router.get("/Items")
def get_cart_items(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    items = db.query(Cart).filter(
        Cart.user_id == current_user.user_id
    ).all()

    return items

@router.delete("/Remove/{product_id}")
def remove_from_cart(
    product_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Cart).filter(
        Cart.user_id == current_user.user_id,
        Cart.product_id == product_id
    ).first()

    if not item:
        return {"message": "Item not found"}

    db.delete(item)
    db.commit()

    return {"message": "Item removed from cart"}
@router.put("/Update/{product_id}")
def update_cart_quantity(
    product_id: int,
    quantity: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Cart).filter(
        Cart.user_id == current_user.user_id,
        Cart.product_id == product_id
    ).first()

    if not item:
        return {"message": "Item not found"}

    if quantity <= 0:
        db.delete(item)
        db.commit()
        return {"message": "Item removed"}

    item.quantity = quantity
    db.commit()

    return {"message": "Quantity updated", "quantity": item.quantity}