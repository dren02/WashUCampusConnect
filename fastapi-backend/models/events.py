from pydantic import BaseModel

class Event(BaseModel):
    name: str
    details_of_event: str
    date: str
    time: str
    address: str
    username: str
    image_url: str = None