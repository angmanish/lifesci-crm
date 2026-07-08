from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models
import schemas
from database import engine, get_db
from agent import chat_with_agent
from typing import List

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HCP CRM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/interactions", response_model=schemas.Interaction)
def create_interaction(interaction: schemas.InteractionCreate, db: Session = Depends(get_db)):
    db_interaction = models.Interaction(**interaction.dict())
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

@app.get("/api/interactions", response_model=List[schemas.Interaction])
def read_interactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    interactions = db.query(models.Interaction).offset(skip).limit(limit).all()
    return interactions

@app.post("/api/chat", response_model=schemas.ChatResponse)
def chat_interaction(chat_request: schemas.ChatRequest):
    try:
        result = chat_with_agent(chat_request.message, chat_request.history)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
