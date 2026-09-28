const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Frontend API Service for DocuMind AI
 */
export const fetchWorkspaces = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/workspaces`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.warn('[API Warning] Could not fetch workspaces:', err);
    return [];
  }
};

export const createWorkspaceAPI = async (name, description) => {
  const res = await fetch(`${API_BASE_URL}/workspaces`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description })
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Could not create workspace');
  }
  return data.data;
};

export const fetchThreads = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/chat/threads`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.warn('[API Warning] Could not fetch threads:', err);
    return [];
  }
};

export const fetchThreadMessages = async (threadId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/chat/threads/${threadId}/messages`);
    const data = await res.json();
    return data.success ? data.data : { messages: [] };
  } catch (err) {
    console.warn('[API Warning] Could not fetch messages:', err);
    return { messages: [] };
  }
};

export const fetchDocuments = async (threadId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/documents?threadId=${threadId}`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.warn('[API Warning] Could not fetch documents:', err);
    return [];
  }
};

export const uploadPDF = async (threadId, file, workspaceId = null) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('threadId', threadId);
  if (workspaceId) formData.append('workspaceId', workspaceId);

  const res = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'PDF Upload failed');
  }
  return data.data;
};

export const deleteDocumentAPI = async (documentId) => {
  const res = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Could not delete document');
  }
  return data.data;
};

export const streamChatTurn = async (threadId, message, onChunk, onTool, onError, onComplete) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId, message })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.replace('data: ', '').trim();
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr);
            if (event.type === 'tool' && onTool) {
              onTool(event.tool_name, event.citations || []);
            } else if (event.type === 'text' && onChunk) {
              onChunk(event.chunk);
            } else if (event.type === 'error' && onError) {
              onError(event.error);
            } else if (event.type === 'done' && onComplete) {
              onComplete();
            }
          } catch (e) {
            console.warn('JSON parse error in SSE chunk:', e);
          }
        }
      }
    }
    if (onComplete) onComplete();
  } catch (err) {
    if (onError) onError(err.message);
  }
};
