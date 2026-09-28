const config = require('../config/environment');

/**
 * Service Layer Module connecting Express API Gateway to Python FastAPI Microservice.
 * Forwards PDF ingestion, thread state, chat queries, and SSE streaming.
 */
class PythonAiService {
  constructor() {
    this.baseUrl = config.pythonBackendUrl;
  }

  /**
   * Health Check Connection to Python Backend
   */
  async checkPythonBackendHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (response.ok) {
        return await response.json();
      }
      return { status: 'unavailable', code: response.status };
    } catch (err) {
      return { status: 'offline', error: err.message };
    }
  }

  /**
   * Fetch All Chat Threads from Python SQLite Checkpointer
   */
  async getThreads() {
    const response = await fetch(`${this.baseUrl}/api/threads`);
    if (!response.ok) {
      throw new Error(`Python AI Service error: ${response.statusText}`);
    }
    return await response.json();
  }

  /**
   * Fetch Conversation Messages for a Specific Thread
   */
  async getThreadMessages(threadId) {
    const response = await fetch(`${this.baseUrl}/api/threads/${threadId}/messages`);
    if (!response.ok) {
      throw new Error(`Python AI Service error: ${response.statusText}`);
    }
    return await response.json();
  }

  /**
   * Ingest PDF Document to Thread FAISS Vector Store
   */
  async ingestDocument(threadId, filename, fileBuffer) {
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });
    formData.append('file', blob, filename);
    formData.append('thread_id', threadId);

    const response = await fetch(`${this.baseUrl}/api/ingest`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.detail || `Ingestion failed with status ${response.status}`);
    }
    return await response.json();
  }

  /**
   * Send Synchronous Chat Query
   */
  async sendChatMessage(threadId, message) {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thread_id: threadId, message })
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.detail || `Chat query failed with status ${response.status}`);
    }
    return await response.json();
  }
}

module.exports = new PythonAiService();
