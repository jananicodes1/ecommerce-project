from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserRegister(BaseModel):
    first_name: str
    last_name: str
    email_address: str
    mobile_number: str
    password: str
    confirm_password: str

class OTPVerify(BaseModel):
    email_address: str
    otp: str

class UserLogin(BaseModel):
    email_address: str
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    mobile_number: Optional[str] = None
    password: Optional[str] = None
    email_address: Optional[str] = None


class UserResponse(BaseModel):
    user_id: int
    first_name: str
    last_name: str
    email_address: str
    mobile_number: str
    password: str
    account_status: str
    registration_date: datetime     

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token:str
    token_type:str="bearer"
    user_id:int
    name:str
    role:str