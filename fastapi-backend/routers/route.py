from fastapi import APIRouter
from models.events import Event
from config.database import events_collection as collection_name
from schema.schemas import list_serializer, event_serializer
from bson import ObjectId

router = APIRouter()

# Get request methods
@router.get("/")
async def get_events(ids: str = None):
    if ids:
        # Split the incoming string into a list of IDs
        event_ids = ids.split(",")  
        object_ids = [ObjectId(id) for id in event_ids]
        events = list_serializer(collection_name.find({"_id": {"$in": object_ids}})) # Fetch events based on ObjectIds
    else:
        events = list_serializer(collection_name.find())  # Fetch all events if no IDs are provided
    return events

@router.get("/{id}")
async def get_event(id: str):
    event = collection_name.find_one({"_id": ObjectId(id)})
    print("Fetched event:", event)  # Debug line
    return event_serializer(event)


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
    
