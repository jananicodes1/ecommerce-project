from models.product import Product

def create_product(db, product_data):
    product = Product(**product_data.dict())

    db.add(product)
    db.commit()
    db.refresh(product)

    return product