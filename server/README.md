# DocuMind AI — Express Node.js API Gateway

The **DocuMind AI Express API Service** provides a RESTful API gateway connecting the React/MERN web frontend to the Python LangGraph AI & Vector RAG microservice.

---

## 📁 Architecture Overview

```text
server/
├── package.json               # Node.js dependencies (express, cors, dotenv, morgan)
├── .env                       # Environment variables
├── .env.example               # Configuration template
└── src/
    ├── index.js               # Express application entry point
    ├── config/
    │   └── environment.js     # Centralized environment configuration
    ├── middleware/
    │   ├── errorHandler.js    # Standard JSON response format & error handling
    │   ├── logger.js          # Sanitized HTTP request logger
    │   └── validateRequest.js # Input validation middleware
    ├── services/
    │   └── pythonAiService.js # Reusable service module for Python AI backend calls
    ├── controllers/           # Endpoint business logic
    └── routes/                # Modular API route definitions
```

---

## ⚡ Documented API Routes

### 1. Health Check
* **GET `/api/health`**
  * Description: Verifies Node.js server health and pings the configured Python backend service.
  * Response: `{ success: true, data: { status: "UP", pythonBackend: { ... } } }`

### 2. Workspaces
* **GET `/api/workspaces`**: List active research workspaces.
* **POST `/api/workspaces`**: Create a new research workspace. Payload: `{ name: string, description?: string }`

### 3. Document Management
* **GET `/api/documents?threadId=xyz`**: Retrieve indexed PDFs for a chat thread.
* **POST `/api/documents/upload`**: Upload and queue a PDF for FAISS vector indexing.

### 4. Chat & Streaming
* **GET `/api/chat/threads`**: List past conversation threads.
* **POST `/api/chat/message`**: Send user research question to the agent graph.

### 5. Research Analysis
* **GET `/api/comparison`**: Retrieve multi-paper comparative analysis matrix.
* **GET `/api/gaps`**: Retrieve literature research gaps & novel hypotheses.
* **GET `/api/claims`**: Retrieve scientific claim verification status.
* **GET `/api/literature-review`**: Retrieve draft systematic literature review.

---

## ⚙️ Environment Variables (`.env`)

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
PYTHON_BACKEND_URL=http://localhost:8000
```

---

## 🚀 Running the Express API Server

1. Navigate to the `server` directory:
   ```powershell
   cd server
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the dev server:
   ```powershell
   npm run dev
   ```
