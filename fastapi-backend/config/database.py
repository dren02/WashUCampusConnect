from pymongo import MongoClient

client = MongoClient("mongodb+srv://<username>:<password>@cluster0.3xx3wpc.mongodb.net/?retryWrites=true&w=majority")

db = client.events

collection_name = db["events_collection"]
