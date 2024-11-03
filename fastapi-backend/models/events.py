from pydantic import BaseModel
from typing import List

class Event(BaseModel):
    name: str
    details_of_event: str
    date: str
    time: str
    address: str
    username: str 
    image_url: str = None
    rsvps: List[str] = []
    comments: List[str] = []
