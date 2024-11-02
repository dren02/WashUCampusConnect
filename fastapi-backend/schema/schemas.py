#schema/schemas.py
# Serializer for events
def event_serializer(event) -> dict:
    return {
        "id": str(event["_id"]),
        "name": event["name"],
        "details_of_event": event["details_of_event"],
        "date": event["date"],
        "time": event["time"],
        "address": event["address"],
        "username": event["username"],
        "image_url": event.get("image_url", "http://localhost:8000/images/default_image.png"),
        "rsvps": event.get("rsvps", [])
    }
 
# Serializer for users
def user_serializer(user) -> dict:
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "password": user["password"],
        "email": user["email"],
        "savedEvents": user.get('savedEvents', []),
        "about": user.get('about', "About section is empty")
    }

# General list serializer that checks the document type
def list_serializer(documents) -> list:
    serialized_list = []
    
    for doc in documents:
        if "name" in doc:  # This means it's an event
            serialized_list.append(event_serializer(doc))
        elif "username" in doc:  # This means it's a user
            serialized_list.append(user_serializer(doc))
    
    return serialized_list


