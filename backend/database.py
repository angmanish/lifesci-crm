import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("MONGODB_DB_NAME", "hcp_crm")

client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
db = client[DATABASE_NAME]
interactions_collection = db["interactions"]

def get_db():
    return db

