from sqlalchemy import Column, Integer, ForeignKey
from database import Base

class Cart(Base):
    __tablename__ = "cart"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("usertable.user_id"),
        nullable=False
    )

    product_id = Column(Integer, nullable=False)

    quantity = Column(Integer, default=1)
