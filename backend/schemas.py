from pydantic import BaseModel
from typing import Optional, List

class InteractionBase(BaseModel):
    hcp_name: str
    specialty: Optional[str] = None
    discussion_topics: Optional[str] = None
    follow_up_date: Optional[str] = None
    notes: Optional[str] = None
    sentiment: Optional[str] = None

class InteractionCreate(InteractionBase):
    pass

class Interaction(InteractionBase):
    id: int

    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []

class ExtractedInfo(BaseModel):
    hcp_name: Optional[str] = None
    specialty: Optional[str] = None
    discussion_topics: Optional[str] = None
    follow_up_date: Optional[str] = None
    notes: Optional[str] = None
    sentiment: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    extracted_info: Optional[ExtractedInfo] = None
