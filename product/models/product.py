from sqlalchemy import Column, Integer, String, Text, Boolean, DECIMAL, TIMESTAMP
from sqlalchemy.sql import func

from userManageApi.database import Base


class Product(Base):

    __tablename__ = "products"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    sku = Column(String(100), unique=True, nullable=False)

    name = Column(String(255), nullable=False)

    slug = Column(String(255), unique=True, nullable=False)

    image_url=Column(String(500), nullable=True)

    short_description = Column(Text)

    description = Column(Text)


    brand_id = Column(Integer)

    category_id = Column(Integer)


    status = Column(
        String(20),
        default="DRAFT"
    )


    base_price = Column(DECIMAL(12,2))

    sale_price = Column(DECIMAL(12,2))


    currency = Column(
        String(10),
        default="USD"
    )


    weight = Column(DECIMAL(10,2))
    length = Column(DECIMAL(10,2))
    width = Column(DECIMAL(10,2))
    height = Column(DECIMAL(10,2))


    is_taxable = Column(
        Boolean,
        default=True
    )


    tax_class = Column(String(100))

    meta_title = Column(String(255))

    meta_description = Column(Text)

    meta_keywords = Column(Text)


    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )


    updated_at = Column(
        TIMESTAMP,
        server_default=func.now(),
        onupdate=func.now()
    )


    created_by = Column(Integer)

    updated_by = Column(Integer)