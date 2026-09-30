from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import models
import schemas
from database import interactions_collection
from agent import chat_with_agent
from typing import List

app = FastAPI(title="HCP CRM API (MongoDB Atlas)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/interactions", response_model=schemas.Interaction)
def create_interaction(interaction: schemas.InteractionCreate):
    try:
        doc = models.create_interaction_doc(interaction.model_dump() if hasattr(interaction, "model_dump") else interaction.dict())
        result = interactions_collection.insert_one(doc)
        doc["_id"] = result.inserted_id
        return models.serialize_interaction(doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"MongoDB Error: {str(e)}")

@app.get("/api/interactions", response_model=List[schemas.Interaction])
def read_interactions(skip: int = 0, limit: int = 100):
    try:
        cursor = interactions_collection.find().skip(skip).limit(limit)
        return [models.serialize_interaction(doc) for doc in cursor]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"MongoDB Error: {str(e)}")

@app.post("/api/chat", response_model=schemas.ChatResponse)
def chat_interaction(chat_request: schemas.ChatRequest):
    try:
        result = chat_with_agent(chat_request.message, chat_request.history)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

