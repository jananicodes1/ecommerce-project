import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, APIRouter, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from userManageApi.database import engine, Base, get_db
from models.user import User
from userManageApi.schemas import (
    UserRegister, OTPVerify, UserLogin, UserUpdate, TokenResponse
)
from userManageApi.security import (
    encrypt_password,
    decrypt_password,
    create_access_token,
    get_current_user,
    require_role
)

import random, smtplib
from email.mime.text import MIMEText


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
router = APIRouter()

Base.metadata.create_all(bind=engine)

otp_store = {}



def send_otp(email, otp):
    sender_email = "janani22042005@gmail.com"
    sender_password = "xfmy ftpv tcok cgmm"

    msg = MIMEText(f"Your OTP is {otp}")
    msg["Subject"] = "OTP Verification"
    msg["From"] = sender_email
    msg["To"] = email

    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login(sender_email, sender_password)
    server.send_message(msg)
    server.quit()



@router.post("/User/Register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing = db.query(User).filter(User.email_address == user.email_address).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    otp = str(random.randint(100000, 999999))

    new_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email_address=user.email_address,
        mobile_number=user.mobile_number,
        password=encrypt_password(user.password),
        account_status="Pending",
        role="user"
    )

    db.add(new_user)
    db.commit()

    otp_store[user.email_address] = otp
    send_otp(user.email_address, otp)

    return {"message": "OTP sent to email", "status": "Pending"}



@router.post("/User/VerifyOTP")
def verify_otp(data: OTPVerify, db: Session = Depends(get_db)):
    saved_otp = otp_store.get(data.email_address)

    if not saved_otp:
        raise HTTPException(status_code=400, detail="OTP not found")

    if saved_otp != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user = db.query(User).filter(User.email_address == data.email_address).first()
    user.account_status = "Active"

    db.commit()
    del otp_store[data.email_address]

    return {"message": "OTP Verified", "status": "Active"}



@router.post("/User/Login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email_address == data.email_address).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.account_status != "Active":
        raise HTTPException(status_code=403, detail="Account not verified")

    if decrypt_password(user.password) != data.password:
        raise HTTPException(status_code=401, detail="Invalid password")

    token = create_access_token(data={
        "sub": str(user.user_id),
        "role": user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": str(user.user_id),
        "name": f"{user.first_name} {user.last_name}",
        "role": user.role
    }


@router.get("/User/Profile")
def get_profile(
    current_user: User = Depends(get_current_user)
):

    return {
        "user_id": current_user.user_id,
        "name": f"{current_user.first_name} {current_user.last_name}",
        "email": current_user.email_address,
        "mobile": current_user.mobile_number,
        "role": current_user.role
    }


@router.put("/User/Update")
def update_user(
    user: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user.first_name:
        current_user.first_name = user.first_name
    if user.last_name:
        current_user.last_name = user.last_name
    if user.mobile_number:
        current_user.mobile_number = user.mobile_number
    if user.email_address:
        current_user.email_address = user.email_address
    if user.password:
        current_user.password = encrypt_password(user.password)

    db.commit()
    return {"message": "Profile updated successfully"}



@router.delete("/User/Delete")
def delete_user(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db.delete(current_user)
    db.commit()
    return {"message": "Account deleted successfully"}



@router.get("/Admin/Users")
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    users = db.query(User).all()

    return [
        {
            "user_id": u.user_id,
            "name": f"{u.first_name} {u.last_name}",
            "email": u.email_address,
            "role": u.role,
            "status": u.account_status
        }
        for u in users
    ]



@router.get("/User/{user_id}")
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    user = db.query(User).filter(User.user_id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "user_id": user.user_id,
        "name": f"{user.first_name} {user.last_name}",
        "email": user.email_address,
        "mobile": user.mobile_number,
        "role": user.role,
        "status": user.account_status
    }



@router.delete("/Admin/User/{user_id}")
def admin_delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    user = db.query(User).filter(User.user_id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"message": f"User {user_id} deleted successfully"}



@router.put("/Admin/User/{user_id}")
def admin_update_user(
    user_id: int,
    user: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    existing = db.query(User).filter(User.user_id == user_id).first()

    if not existing:
        raise HTTPException(status_code=404, detail="User not found")

    if user.first_name:
        existing.first_name = user.first_name
    if user.last_name:
        existing.last_name = user.last_name
    if user.mobile_number:
        existing.mobile_number = user.mobile_number
    if user.email_address:
        existing.email_address = user.email_address
    if user.password:
        existing.password = encrypt_password(user.password)

    db.commit()

    return {"message": f"User {user_id} updated successfully"}



app.include_router(router)
