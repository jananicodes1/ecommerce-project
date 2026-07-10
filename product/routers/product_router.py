from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db
from models.product import Product
from schemas.product_schema import (
    ProductCreate,
    ProductUpdate,
    ProductResponse
)


router = APIRouter(
    prefix="/products",
    tags=["Products"]
)



@router.post("/", response_model=ProductResponse)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):

    new_product = Product(**product.model_dump())

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product




@router.get("/", response_model=list[ProductResponse])
def get_products(
    db: Session = Depends(get_db)
):

    products = db.query(Product).all()

    return products




@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()


    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product Not Found"
        )

    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()


    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product Not Found"
        )


    for key, value in product_data.model_dump(exclude_unset=True).items():
        setattr(product, key, value)


    db.commit()
    db.refresh(product)

    return product




@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()


    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product Not Found"
        )


    db.delete(product)
    db.commit()


    return {
        "message": "Product deleted successfully"
    }