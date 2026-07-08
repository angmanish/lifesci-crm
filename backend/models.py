from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base
import datetime

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String, index=True)
    specialty = Column(String, index=True)
    discussion_topics = Column(Text)
    follow_up_date = Column(String, nullable=True)
    notes = Column(Text)
    sentiment = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
