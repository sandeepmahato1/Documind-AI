# 🧠 DocuMind AI — Enterprise Multi-PDF RAG & Citation Platform

**DocuMind AI** is an advanced, production-ready AI research platform built with **LangGraph**, **Google Gemini**, **FAISS Vector Search**, **MongoDB**, **Express Gateway**, and **React (Vite)**.

It supports reliable, evidence-grounded question answering across multiple PDFs in dedicated research workspaces with page-level inline citations (`[Document Name, p. X]`) and an interactive Evidence Inspector.

---

## 🏗️ Architecture & Technology Stack

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                       React 18 Frontend (Vite)                         │
│             (Vibrant Lavender Identity, Evidence Drawer UI)             │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTP / SSE Stream
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     Node.js Express API Gateway                         │
│           (Port 5000, Mongoose MongoDB Workspace Management)            │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTP Proxy / SSE Forwarding
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  Python FastAPI AI Agent Microservice                   │
│          (Port 8000, LangGraph Agent Graph, FAISS Multi-PDF Store)      │
└─────────────────────────────────────────────────────────────────────────┘
```

### Stack Components
- **Frontend**: React 18, Vite, Lucide Icons, Vanilla CSS Design Tokens (Glassmorphism & Lavender Identity).
- **API Gateway**: Node.js, Express, Mongoose, MongoDB (`Workspace` & `Document` metadata schemas, MD5 deduplication).
- **AI Microservice**: Python, FastAPI, LangGraph, Google Gemini (`gemini-2.5-flash`), FAISS Vector Index, SQLite Checkpointer (`chatbot.db`).

---

## ⚡ Core Features

1. **📄 Multi-PDF Workspaces & Management**
   - Create, rename, and organize research workspaces.
   - Upload multiple PDFs per workspace thread with automated MD5 deduplication.
   - Track chunk count, page count, and indexing status.

2. **📌 Page-Level Citations & Grounded Evidence**
   - Automatically attaches 1-indexed page numbers and document filenames to vector chunks.
   - Answers include exact inline citations in format `[Document Name, p. 5]`.
   - Displays interactive citation badges and an **Expandable Evidence Panel** showing supporting text excerpts.

3. **🛡️ Strict Anti-Hallucination & Evidence Rules**
   - If documents do not contain sufficient evidence, DocuMind AI explicitly states: *"The uploaded documents do not contain sufficient evidence to answer this question."*
   - Prevents cross-workspace retrieval and avoids inventing fake page numbers or citations.

4. **🛠️ Agentic Multi-Tool Execution**
   - **Multi-PDF RAG (`rag_tool`)**: Similarity search across all loaded documents.
   - **Web Search (`DuckDuckGoSearchRun`)**: Real-time web info.
   - **Stock Price Tracker (`get_stock_price`)**: Financial quote data via Alpha Vantage API.
   - **Calculator (`calculator`)**: Arithmetic logic.

5. **💬 SSE Real-Time Streaming & Checkpointing**
   - Live token-by-token streaming via Server-Sent Events (SSE).
   - LangGraph SQLite state checkpointer (`chatbot.db`) for resuming conversation history across sessions.

---

## 📁 Repository Structure

```text
DocuMind-AI/
├── frontend/                     # React 18 Vite SPA Frontend
│   ├── src/
│   │   ├── components/          # Top Navbar & Navigation
│   │   ├── pages/               # WorkspacesPage, ChatPage, DocumentsPage
│   │   └── services/            # API Gateway Service & SSE Streamer
│   └── package.json
├── server/                       # Node.js Express API Gateway
│   ├── src/
│   │   ├── config/              # MongoDB & Environment Config
│   │   ├── models/              # Mongoose Workspace & Document Schemas
│   │   ├── routes/              # Workspace, Document, & Chat Proxy Routes
│   │   └── services/            # Python Microservice HTTP Client
│   └── package.json
├── langgraph_rag_backend.py      # Core LangGraph Agent State Graph & RAG Tools
├── py_api.py                     # FastAPI HTTP & SSE Streaming Microservice
├── chatbot.db                    # SQLite State Checkpointer
├── .env.example                  # Environment Variables Template
└── README.md                     # Documentation
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Python**: 3.10+
- **Node.js**: 18+
- **MongoDB**: Active instance at `mongodb://127.0.0.1:27017/documind`
- **Google Gemini API Key**: Obtain from [Google AI Studio](https://aistudio.google.com/)

### 2. Environment Setup
Copy `.env.example` to `.env` in the root directory:

```bash
cp .env.example .env
```

Set your Google API Key in `.env`:
```env
GOOGLE_API_KEY=your_google_gemini_api_key_here
MONGODB_URI=mongodb://127.0.0.1:27017/documind
PORT=5000
PYTHON_BACKEND_URL=http://127.0.0.1:8000
```

---

### 3. Install Dependencies

#### Python AI Microservice:
```bash
pip install -r requirements.txt
# Or manually:
pip install langgraph langchain-google-genai langchain-community faiss-cpu pypdf duckduckgo-search fastapi uvicorn python-dotenv requests
```

#### Node Express API Gateway:
```bash
cd server
npm install
```

#### React Frontend:
```bash
cd ../frontend
npm install
```

---

### 4. Running the Microservices

#### Step A: Start Python FastAPI Service (Port 8000)
```bash
python -m uvicorn py_api:app --port 8000 --host 127.0.0.1
```

#### Step B: Start Express API Gateway (Port 5000)
```bash
cd server
node src/index.js
```

#### Step C: Start React Frontend Dev Server (Port 5173)
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser! 🚀

---

## 🛠️ Verification & Building for Production

### Frontend Production Build:
```bash
cd frontend
npm run build
```

---

## 📄 License
MIT License. Built for advanced document intelligence and multi-PDF evidence retrieval.
