from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from cryptography.fernet import Fernet
from sqlalchemy.orm import Session
from database import get_db
from models.user import User


SECRET_KEY = "secret123"
ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 10080



FERNET_KEY = "kS_R21ViAHtV7VmkWWC_BW1VCRAVm8yN06Gdsx4pBb0="

fernet = Fernet(FERNET_KEY)




def encrypt_password(password):

    encrypted = fernet.encrypt(
        password.encode()
    )

    return encrypted.decode()




def decrypt_password(password):

    decrypted = fernet.decrypt(
        password.encode()
    )

    return decrypted.decode()





security = HTTPBearer()


def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({
        "exp": expire
    })


    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )



def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):

    token = credentials.credentials


    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )


        user_id = int(payload["sub"])


        user = db.query(User).filter(
            User.user_id == user_id
        ).first()


        if not user:

            raise HTTPException(
                status_code=404,
                detail="User not found"
            )


        return user


    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )



def require_role(role:str):

    def checker(
        user = Depends(get_current_user)
    ):

        if user.role != role:

            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )

        return user


    return checker
