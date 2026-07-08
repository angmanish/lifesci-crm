import os
import json
from dotenv import load_dotenv
load_dotenv()
from typing import Dict, TypedDict, Any
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END
from schemas import ExtractedInfo

class AgentState(TypedDict):
    messages: list
    extracted_info: dict

# System prompt to guide the extraction
SYSTEM_PROMPT = """You are an AI assistant for a pharmaceutical field representative.
Your job is to chat with the rep and extract structured data about their interactions with Healthcare Professionals (HCPs).
If the user provides information about an interaction, extract any of the following fields:
- hcp_name: The name of the doctor or healthcare professional.
- specialty: Their medical specialty.
- discussion_topics: What was discussed (e.g., drugs, treatments).
- follow_up_date: When the rep should follow up.
- notes: Any additional notes.
- sentiment: The sentiment of the interaction (Positive, Neutral, Negative).

Respond naturally to the user. Additionally, you must ALWAYS output a JSON block containing the extracted information at the very end of your response, enclosed in ```json ... ``` tags.
If a field is not mentioned, do not include it or set it to null.
Example response:
Got it! I've noted down your meeting with Dr. Smith.
```json
{"hcp_name": "Dr. Smith", "specialty": "Cardiology", "sentiment": "Positive"}
```
"""

def create_agent():
    # Attempt to load Groq model
    try:
        llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)
    except Exception as e:
        print(f"Warning: Could not initialize ChatGroq. Check GROQ_API_KEY. Error: {e}")
        llm = None

    def process_message(state: AgentState):
        messages = state['messages']
        # prepend system message if not present
        if not messages or not isinstance(messages[0], SystemMessage):
            messages = [SystemMessage(content=SYSTEM_PROMPT)] + messages
            
        if llm:
            response = llm.invoke(messages)
            ai_message = response.content
        else:
            ai_message = "Mock response since Groq API key is missing. Please set GROQ_API_KEY.\n```json\n{\"hcp_name\": \"Mock Doctor\"}\n```"
            
        return {"messages": [ai_message]}

    def extract_info(state: AgentState):
        messages = state['messages']
        last_message = messages[-1]
        
        extracted = state.get('extracted_info', {})
        content = last_message if isinstance(last_message, str) else last_message.content
        
        # Simple extraction of JSON block
        if "```json" in content:
            try:
                json_str = content.split("```json")[1].split("```")[0].strip()
                new_info = json.loads(json_str)
                # merge with existing
                extracted.update({k: v for k, v in new_info.items() if v is not None})
                
                # Clean up the message for the user
                cleaned_message = content.split("```json")[0].strip()
                messages[-1] = cleaned_message
            except Exception as e:
                print(f"Error parsing JSON from LLM: {e}")
                
        return {"extracted_info": extracted, "messages": messages}

    workflow = StateGraph(AgentState)
    workflow.add_node("process", process_message)
    workflow.add_node("extract", extract_info)
    
    workflow.set_entry_point("process")
    workflow.add_edge("process", "extract")
    workflow.add_edge("extract", END)
    
    return workflow.compile()

agent_app = create_agent()

def chat_with_agent(message: str, history: list = None):
    # Prepare history
    from langchain_core.messages import AIMessage
    messages = [SystemMessage(content=SYSTEM_PROMPT)]
    if history:
        for msg in history:
            role = msg.get('role')
            content = msg.get('content')
            if role == 'user':
                messages.append(HumanMessage(content=content))
            elif role == 'ai':
                messages.append(AIMessage(content=content))
                
    messages.append(HumanMessage(content=message))
    
    state = {"messages": messages, "extracted_info": {}}
    result = agent_app.invoke(state)
    
    final_messages = result['messages']
    last_msg = final_messages[-1] if isinstance(final_messages[-1], str) else final_messages[-1].content
    
    return {
        "response": last_msg,
        "extracted_info": result['extracted_info']
    }
