from pydantic import BaseModel
from typing import Optional
from decimal import Decimal


class ProductCreate(BaseModel):
    sku: str
    name: str
    slug: str
    image_url:Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    brand_id: Optional[int] = None
    category_id: Optional[int] = None
    status: str = "DRAFT"
    base_price: Optional[Decimal] = None
    sale_price: Optional[Decimal] = None
    currency: str = "INR"
    weight: Optional[Decimal] = None
    length: Optional[Decimal] = None
    width: Optional[Decimal] = None
    height: Optional[Decimal] = None
    is_taxable: bool = True
    tax_class: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None


class ProductUpdate(BaseModel):
    sku: Optional[str] = None
    name: Optional[str] = None
    slug: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    brand_id: Optional[int] = None
    category_id: Optional[int] = None
    status: Optional[str] = None
    base_price: Optional[Decimal] = None
    sale_price: Optional[Decimal] = None
    currency: Optional[str] = None
    weight: Optional[Decimal] = None
    length: Optional[Decimal] = None
    width: Optional[Decimal] = None
    height: Optional[Decimal] = None
    is_taxable: Optional[bool] = None
    tax_class: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None


class ProductResponse(BaseModel):
    id: int  # autoincrement integer
    sku: str
    name: str
    slug: str
    image_url:Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    brand_id: Optional[int] = None
    category_id: Optional[int] = None
    status: str
    base_price: Optional[Decimal] = None
    sale_price: Optional[Decimal] = None
    currency: str
    weight: Optional[Decimal] = None
    length: Optional[Decimal] = None
    width: Optional[Decimal] = None
    height: Optional[Decimal] = None
    is_taxable: bool
    tax_class: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None

    class Config:
        from_attributes = True