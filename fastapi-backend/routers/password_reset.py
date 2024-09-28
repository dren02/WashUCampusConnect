#routers.password_reset.py
from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from config.database import users_collection  # Import your user collection
import smtplib, ssl

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

FORGET_PWD_SECRET_KEY = "your_secret_key"  # Replace with your actual secret key
ALGORITHM = "HS256"

class ForgetPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    secret_token: str
    new_password: str
    confirm_password: str

# Function to create a reset password token
def create_reset_password_token(email: str):
    data = {"sub": email, "exp": datetime.utcnow() + timedelta(minutes=10)}
    token = jwt.encode(data, FORGET_PWD_SECRET_KEY, algorithm=ALGORITHM)
    return token


@router.post("/forget-password")
async def forget_password(
    background_tasks: BackgroundTasks,
    fpr: ForgetPasswordRequest
):
    # Fetch the user from the database
    user = users_collection.find_one({"email": fpr.email})
    if user is None:
        raise HTTPException(status_code=404, detail="Invalid email address")
    
    smtp_server = "smtp.gmail.com"
    port = 587  # For starttls
    sender_email = "campus.events.service@gmail.com"
    receiver_email = fpr.email
    password = "aluy xmdf cwbn qkye" # Your email password
    context = ssl.create_default_context()

    # Create the reset password token
    secret_token = create_reset_password_token(email=user["email"])
    reset_link = f"http://localhost:3000/reset-password/{secret_token}"  # Change to your frontend URL
    
    message = f"""\
Subject: Password Reset Instructions

Hi,
To reset your password, please click the link below:
{reset_link}
This link will expire in 10 minutes.
Thank you!
Campus Events
"""
    try:
        server = smtplib.SMTP(smtp_server,port)
        server.ehlo() # Can be omitted
        server.starttls(context=context) # Secure the connection
        server.ehlo() # Can be omitted
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message)
    except Exception as e:
        print(e)
    finally:
        server.quit()


    return {"message": "Email has been sent"}


@router.post("/reset-password")
async def reset_password(rfp: ResetPasswordRequest):
    try:
        # Decode the token to get the email
        payload = jwt.decode(rfp.secret_token, FORGET_PWD_SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid token or link expired.")

    # Check if the new passwords match
    if rfp.new_password != rfp.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")
    
    # Hash the new password and update it in the database
    hashed_password = pwd_context.hash(rfp.new_password)
    users_collection.update_one({"email": email}, {"$set": {"password": hashed_password}})
    
    return {"message": "Password reset successfully!"}



