# models/user.py
from pydantic import BaseModel
from typing import List

class User(BaseModel):
    username: str
    password: str
    email: str
    savedEvents: List[str] = []



