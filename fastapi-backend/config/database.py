from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb+srv://admin:admin123@cluster0.tfjwq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

# Access the 'events' database
db = client.events

# Create or access the 'events_collection' for events
events_collection = db["events_collection"]

# Create or access the 'users_collection' for users
users_collection = db["users_collection"]

# Now you can interact with the 'users_collection' separately from the 'events_collection'
