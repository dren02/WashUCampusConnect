from fastapi import APIRouter, HTTPException, Depends, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import jwt, JWTError
from pydantic import BaseModel
from config.database import users_collection  # Use users_collection now
import os
import random
import string
from datetime import datetime, timedelta
from schema.schemas import list_serializer
from bson import ObjectId
from models.user import User

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(32)))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# OAuth2PasswordBearer for token-based authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter()

# Hash password
def hash_password(password: str):
    return pwd_context.hash(password)

# Verify password
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# Create access token
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

class SaveEventRequest(BaseModel):
    eventId: str 

@router.delete("/{username}")
async def delete_user(username: str):
    result = users_collection.find_one_and_delete({"username": username})
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted successfully"}


@router.get("/")
async def get_users():
    users = users_collection.find()
    print(users)
    serialized_users = list_serializer(users)
    if not serialized_users:
        return {"message": "No users found"}
    return serialized_users


# Signup
@router.post("/signup/")
async def signup(user: User):
    # Check if the username already exists in the users collection
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already exists")
    # Hash the password and store the user in the users collection
    hashed_password = hash_password(user.password)
    email = user.email
    users_collection.insert_one({"username": user.username, "password": hashed_password, "email": email, "role": user.role})
    return {"message": "User created successfully"}

# Login and Token generation
@router.post("/token/")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_collection.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    # Create JWT token
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer", "username": user["username"], "role": user["role"]}

# Protect routes with token
@router.get("/protected/")
async def protected_route(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    return {"message": f"Hello {username}, you have access to this protected route."}

@router.put("/{username}/save-event/")
async def save_event(username: str, save_event_request: SaveEventRequest):
    print(f"Received request from user: {username}, eventId: {save_event_request.eventId}")
    # Update the user's savedEvents field by adding the eventId
    result = users_collection.find_one_and_update(
        {"username": username},  # Match the user by username
        {"$addToSet": {"savedEvents": save_event_request.eventId}},  # Avoid duplicates
        return_document=True  # Return the updated document
    )
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Event saved successfully", "savedEvents": result['savedEvents']}


@router.put("/{username}/update-about/")
async def update_about(username: str, about: str = Body(..., media_type="text/plain")):
    result = users_collection.find_one_and_update(
        {"username": username},
        {"$set": {"about": about}},
        return_document=True
    )
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "About section updated", "about": result['about']}


@router.get("/{username}/about")
async def get_about(username: str):
    user = users_collection.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"about": user.get("about", "")}

@router.put("/{username}/change-password")
async def change_password(username: str, new_password: str = Body(..., media_type="text/plain")):
    hashed_password = hash_password(new_password)
    result = users_collection.find_one_and_update(
        {"username": username},
        {"$set": {"password": hashed_password}} 
    )
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "Password changed successfully"}


