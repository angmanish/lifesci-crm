import datetime
from typing import Dict, Any

def create_interaction_doc(data: Dict[str, Any]) -> Dict[str, Any]:
    """Prepare a new interaction dictionary for insertion into MongoDB Atlas."""
    return {
        "hcp_name": data.get("hcp_name"),
        "specialty": data.get("specialty"),
        "discussion_topics": data.get("discussion_topics"),
        "follow_up_date": data.get("follow_up_date"),
        "notes": data.get("notes"),
        "sentiment": data.get("sentiment", "Neutral"),
        "created_at": datetime.datetime.utcnow(),
    }

def serialize_interaction(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Convert MongoDB BSON document (_id ObjectId) into JSON-serializable dict."""
    return {
        "id": str(doc["_id"]),
        "hcp_name": doc.get("hcp_name", ""),
        "specialty": doc.get("specialty"),
        "discussion_topics": doc.get("discussion_topics"),
        "follow_up_date": doc.get("follow_up_date"),
        "notes": doc.get("notes"),
        "sentiment": doc.get("sentiment", "Neutral"),
        "created_at": doc.get("created_at"),
    }

