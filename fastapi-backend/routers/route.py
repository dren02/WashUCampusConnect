from fastapi import APIRouter, Form, File, UploadFile, HTTPException
from models.events import Event
from config.database import events_collection as collection_name
from config.database import users_collection
from schema.schemas import list_serializer, event_serializer
from bson import ObjectId
from pathlib import Path
import shutil
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import aiosmtplib
from email.mime.text import MIMEText
import asyncio


router = APIRouter()


# Email configuration
SMTP_SERVER = "smtp.gmail.com"  # Replace with your SMTP server
SMTP_PORT = 587
EMAIL_ADDRESS = "campus.events.service@gmail.com"
EMAIL_PASSWORD = "aluy xmdf cwbn qkye"

scheduler = BackgroundScheduler()
scheduler.start()



# Function to send email
async def send_email(to_email: str, subject: str, body: str):
    msg = MIMEText(body)
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email
    msg["Subject"] = subject

    try:
        await aiosmtplib.send(
            msg,
            hostname=SMTP_SERVER,
            port=SMTP_PORT,
            username=EMAIL_ADDRESS,
            password=EMAIL_PASSWORD,
            use_tls=False,  # Disable implicit TLS

        )
        print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")


# Function to schedule email notifications
def schedule_email(event_id: str, email: str, event_name: str, event_date: str, event_time: str, event_address: str):
    event_datetime = datetime.strptime(f"{event_date} {event_time}", "%Y-%m-%d %H:%M")
    notification_time = event_datetime - timedelta(hours=24)

    # Wrapper to run async function in a synchronous context
    def run_async_send_email():
        asyncio.run(
            send_email(
                to_email=email,
                subject=f"Reminder: Upcoming Event - {event_name}",
                body=f"Hello,\n\nThis is a reminder that you have RSVP'd to the event '{event_name}'.\n\nDetails:\nDate: {event_date}\nTime: {event_time}\nAddress: {event_address}\n\nThank you!",
            )
        )

    # Schedule the email
    scheduler.add_job(
        func=run_async_send_email,
        trigger="date",
        run_date=notification_time,
        id=f"email_{event_id}_{email}",  # Unique ID for the job
        replace_existing=True,  # Overwrite if the same job ID exists
    )
    print(f"Notification scheduled for {email} at {notification_time}")




# Get request methods
@router.get("/")
async def get_events(ids: str = None):
    if ids:
        event_ids = ids.split(",")  
        object_ids = [ObjectId(id) for id in event_ids]
        events = list_serializer(collection_name.find({"_id": {"$in": object_ids}}))  # Fetch events based on ObjectIds
    else:
        events = list_serializer(collection_name.find())  # Fetch all events if no IDs are provided
    return events

@router.get("/{id}")
async def get_event(id: str):
    event = collection_name.find_one({"_id": ObjectId(id)})
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
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

    # Create event data with image URL and empty rsvps list
    event_data = {
        "name": name,
        "details_of_event": details_of_event,
        "date": date,
        "time": time,
        "address": address,
        "username": username,
        "image_url": image_url,
        "rsvps": [],  # Initialize RSVPs as an empty list
        "comments": []  # Initialize comments as an empty list
    }
    collection_name.insert_one(event_data)
    return event_serializer(event_data)


# RSVP endpoint with email scheduling
@router.post("/{id}/rsvp")
async def add_rsvp(id: str, username: str = Form(...), notifications: bool = Form(...)):
    event = collection_name.find_one({"_id": ObjectId(id)})
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")

    if username in event.get("rsvps", []):
        # User is already RSVP'd, remove them
        collection_name.update_one(
            {"_id": ObjectId(id)},
            {"$pull": {"rsvps": username}}  # Remove username from RSVPs
        )
        return {"message": "RSVP removed successfully!"}
    else:
        # User is not RSVP'd, add them
        collection_name.update_one(
            {"_id": ObjectId(id)},
            {"$push": {"rsvps": username}}  # Add username to RSVPs
        )
        EMAIL_ADDRESS = users_collection.find_one({"username": username})["email"]
        if notifications:
            # Schedule email notification
            schedule_email(
                event_id=id,
                email=EMAIL_ADDRESS,
                event_name=event["name"],
                event_date=event["date"],
                event_time=event["time"],
                event_address=event["address"],
            )

        return {"message": "RSVP successful and notification scheduled!"}





# Endpoint to add a comment to an event
@router.post("/{id}/comment")
async def add_comment(id: str, username: str = Form(...), comment: str = Form(...)):
    event = collection_name.find_one({"_id": ObjectId(id)})
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")

    # Append the new comment to the comments list
    collection_name.update_one(
        {"_id": ObjectId(id)},
        {"$push": {"comments": f"{username}: {comment}"}}  # Add the new comment
    )
    return {"message": "Comment added successfully!"}


# Put request methods
@router.put("/{id}")
async def put_event(
    id: str,
    name: str = Form(...),
    details_of_event: str = Form(...),
    date: str = Form(...),
    time: str = Form(...),
    address: str = Form(...),
    username: str = Form(...),
    image: UploadFile = File(None),  # Optional image upload for edit
    rsvps: list[str] = Form(None),  # Optional RSVPs list
    comments: list[str] = Form(None)  # Optional comments list
):
    # Handle optional image update
    image_url = None
    if image:
        image_dir = Path("images")
        image_dir.mkdir(exist_ok=True)  # Ensure the directory exists
        image_path = image_dir / image.filename
        with image_path.open("wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_url = f"http://localhost:8000/images/{image.filename}"

    # Update event data with image URL if provided
    event_data = {
        "name": name,
        "details_of_event": details_of_event,
        "date": date,
        "time": time,
        "address": address,
        "username": username,
    }
    if image_url:
        event_data["image_url"] = image_url  # Only update image URL if a new image is uploaded
    if rsvps is not None:
        event_data["rsvps"] = rsvps  # Update the RSVP list if provided
    if comments is not None:
        event_data["comments"] = comments
    

    # Update the event document
    updated_event = collection_name.find_one_and_update({"_id": ObjectId(id)}, {"$set": event_data}, return_document=True)
    if updated_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return event_serializer(updated_event)

# Delete request methods
@router.delete("/{id}")
async def delete_event(id: str):
    result = collection_name.find_one_and_delete({"_id": ObjectId(id)})
    if result is None:
        raise HTTPException(status_code=404, detail="Event not found")
