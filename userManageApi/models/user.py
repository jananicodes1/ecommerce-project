from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone
from database import Base

class User(Base):
    __tablename__ = "usertable"

    user_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email_address = Column(String, unique=True, nullable=False)
    mobile_number = Column(String, nullable=False)
    password = Column(String, nullable=False)
    account_status = Column(String, default="Pending")
    role = Column(String(20), default="user", nullable=False)
    registration_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
