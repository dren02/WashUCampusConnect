from fastapi import APIRouter
from models.events import Event
from config.database import events_collection as collection_name
from schema.schemas import list_serializer
from bson import ObjectId

router = APIRouter()

# Get request methods
@router.get("/")
async def get_events():
    events = list_serializer(collection_name.find())
    print(events)
    return events

# Post request methods
@router.post("/")
async def create_event(event: Event):
    collection_name.insert_one(dict(event))


# Put request methods
@router.put("/{id}")
async def put_event(id: str, event: Event):
    collection_name.find_one_and_update({"_id": ObjectId(id)}, {"$set": dict(event)})


# Delete request methods
@router.delete("/{id}")
async def delete_event(id: str):
    collection_name.find_one_and_delete({"_id": ObjectId(id)})
    
