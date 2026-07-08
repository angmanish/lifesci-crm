# LifeSci CRM: AI-First Healthcare Professional Management

An AI-powered Customer Relationship Management (CRM) system designed specifically for Pharmaceutical and Life Science Field Representatives. 

This platform allows representatives to effortlessly log interactions with Healthcare Professionals (HCPs) through a natural conversational interface. Instead of filling out tedious forms, reps can simply chat with the AI about their meeting, and the system automatically extracts the relevant structured data (HCP Name, Specialty, Sentiment, Follow-up Dates, etc.) and saves it to the database.

## 🚀 Features

- **AI-Powered Data Extraction:** Chat with the built-in AI assistant. It automatically parses natural language into structured database records using LangGraph.
- **Dual-Pane Interaction Screen:** Chat on the left, watch the structured form auto-populate on the right. 
- **Professional SaaS Interface:** A premium, fully responsive React UI with Redux state management, featuring Light & Dark modes.
- **Analytics Dashboard:** View your pipeline, positive sentiment ratios, and pending follow-ups at a glance.
- **HCP Directory:** Keep track of all interactions, grouped automatically by healthcare professional.

## 🛠️ Technology Stack

- **Frontend:** React, Vite, Redux Toolkit, CSS3 (Custom Design System), Lucide Icons
- **Backend:** Python, FastAPI, SQLAlchemy, SQLite (Local Development)
- **AI Framework:** LangChain & LangGraph (State machine for conversational data extraction)
- **LLM Provider:** Groq (`llama-3.3-70b-versatile` model for lightning-fast inference)

## 💻 Getting Started (Local Development)

### 1. Backend Setup
Navigate to the backend directory and set up the Python environment:
```bash
cd backend
python -m venv venv
# Activate virtual environment (Windows)
.\venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the `backend` folder and add your Groq API key:
```env
GROQ_API_KEY=your_groq_api_key_here
```

Start the FastAPI server:
```bash
uvicorn main:app --reload
```

### 2. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser to view the application!

## 🔒 Environment Variables
- `GROQ_API_KEY`: Required for the AI extraction engine to function. Get a free API key at [console.groq.com](https://console.groq.com).

## 📄 License
This project is open-source and available under the MIT License.
