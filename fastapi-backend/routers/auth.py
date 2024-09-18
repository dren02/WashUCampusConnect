from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
from config.database import collection_name
from schema.schemas import list_serializer
from models.user import User



router = APIRouter()


# Signup
@router.post("/signup/")
async def signup(user: User):
    # Check if the username already exists
    if collection_name.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Insert user into the database
    collection_name.insert_one({"username": user.username, "password": user.password})
    return {"message": "User created successfully"}

# Login
@router.post("/login/")
async def login(user: User):
    db_user = collection_name.find_one({"username": user.username})
    
    if not db_user or db_user['password'] != user.password:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    return {"message": "Login successful"}
