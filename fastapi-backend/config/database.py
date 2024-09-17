from pymongo import MongoClient

client = MongoClient("mongodb+srv://admin:admin123@cluster0.tfjwq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

db = client.events

collection_name = db["events_collection"]
