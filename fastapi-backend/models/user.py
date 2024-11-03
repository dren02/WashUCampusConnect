# models/user.py
from pydantic import BaseModel
from typing import List

class User(BaseModel):
    username: str
    password: str
    email: str
    role: str 
    savedEvents: List[str] = []
    about: str = "About section is empty"
    



