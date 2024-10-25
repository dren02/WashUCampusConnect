from fastapi import APIRouter, Form, File, UploadFile, HTTPException
from models.events import Event
from config.database import events_collection as collection_name
from schema.schemas import list_serializer, event_serializer
from bson import ObjectId
from pathlib import Path
import shutil
import json

router = APIRouter()

# Get request methods
@router.get("/")
async def get_events(ids: str = None):
    if ids:
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
async def create_event(
    name: str = Form(...),
    details_of_event: str = Form(...),
    date: str = Form(...),
    time: str = Form(...),
    address: str = Form(...),
    username: str = Form(...),
    image: UploadFile = File(None)  # Optional image upload
):
    # Handle optional image upload
    image_url = "http://localhost:8000/images/default_image.png"
    if image:
        image_dir = Path("images")
        image_dir.mkdir(exist_ok=True)  # Ensure the directory exists
        image_path = image_dir / image.filename
        with image_path.open("wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_url = f"http://localhost:8000/images/{image.filename}"

    # Create event data with image URL
    event_data = {
        "name": name,
        "details_of_event": details_of_event,
        "date": date,
        "time": time,
        "address": address,
        "username": username,
        "image_url": image_url,
    }
    collection_name.insert_one(event_data)
    return event_serializer(event_data)


# Put request methods
@router.put("/{id}")
async def put_event(id: str, event: Event):
    collection_name.find_one_and_update({"_id": ObjectId(id)}, {"$set": dict(event)})


# Delete request methods
@router.delete("/{id}")
async def delete_event(id: str):
    collection_name.find_one_and_delete({"_id": ObjectId(id)})
