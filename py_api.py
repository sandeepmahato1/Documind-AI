"""
FastAPI HTTP & SSE Service Layer for DocuMind AI (LangGraph RAG Backend)
Preserves all working LangGraph features: PDF ingestion, FAISS, Tools, SQLite Checkpointing.
"""

from __future__ import annotations

import json
import asyncio
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage

from langgraph_rag_backend import (
    chatbot,
    ingest_pdf,
    retrieve_all_threads,
    thread_document_metadata,
    thread_has_document,
    get_thread_title,
    remove_document
)

app = FastAPI(
    title="DocuMind AI Python LangGraph Microservice",
    version="1.0.0",
    description="Thin HTTP & SSE Streaming API for LangGraph RAG Agent Graph"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.delete("/api/documents/{thread_id}")
def delete_document(thread_id: str):
    removed = remove_document(thread_id)
    return {"success": True, "thread_id": thread_id, "removed": removed}

# Request Models
class ChatRequest(BaseModel):
    thread_id: str
    message: str

def format_msg_content(msg: Any) -> str:
    content = msg.content
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        text = ""
        for part in content:
            if isinstance(part, dict) and part.get("type") == "text":
                text += part.get("text", "")
        return text
    return str(content)

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "DocuMind AI Python LangGraph Microservice",
        "engine": "Google Gemini + LangGraph + FAISS RAG"
    }

@app.get("/api/threads")
def list_threads():
    try:
        thread_ids = retrieve_all_threads()
        result = []
        for tid in thread_ids:
            str_id = str(tid)
            result.append({
                "thread_id": str_id,
                "title": get_thread_title(str_id),
                "has_document": thread_has_document(str_id),
                "document_metadata": thread_document_metadata(str_id)
            })
        return {"threads": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/threads/{thread_id}/messages")
def get_thread_messages(thread_id: str):
    try:
        state = chatbot.get_state(config={"configurable": {"thread_id": str(thread_id)}})
        raw_messages = state.values.get("messages", [])
        formatted_messages = []
        pending_citations = []
        
        for msg in raw_messages:
            if isinstance(msg, ToolMessage):
                if getattr(msg, "name", "") == "rag_tool":
                    try:
                        content_obj = json.loads(msg.content)
                        if isinstance(content_obj, dict) and "citations" in content_obj:
                            pending_citations = content_obj.get("citations", [])
                    except Exception:
                        pass
                continue

            role = "user" if isinstance(msg, HumanMessage) else "assistant"
            text = format_msg_content(msg)
            if text.strip():
                msg_item = {
                    "role": role,
                    "content": text
                }
                if role == "assistant" and pending_citations:
                    msg_item["citations"] = pending_citations
                    pending_citations = []
                formatted_messages.append(msg_item)

        return {
            "thread_id": thread_id,
            "messages": formatted_messages,
            "has_document": thread_has_document(thread_id),
            "document_metadata": thread_document_metadata(thread_id)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ingest")
async def ingest_document(
    file: UploadFile = File(...),
    thread_id: str = Form(...)
):
    try:
        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(status_code=400, detail="Empty file submitted.")

        summary = ingest_pdf(
            file_bytes=file_bytes,
            thread_id=thread_id,
            filename=file.filename
        )
        return {
            "success": True,
            "thread_id": thread_id,
            "summary": summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF ingestion failed: {str(e)}")

@app.post("/api/chat")
def chat_sync(request: ChatRequest):
    try:
        config = {
            "configurable": {"thread_id": str(request.thread_id)},
            "metadata": {"thread_id": str(request.thread_id)},
            "run_name": "chat_turn"
        }

        response = chatbot.invoke(
            {"messages": [HumanMessage(content=request.message)]},
            config=config
        )

        messages = response.get("messages", [])
        ai_response_text = ""
        tools_used = []
        citations = []

        for msg in reversed(messages):
            if isinstance(msg, AIMessage) and not ai_response_text:
                ai_response_text = format_msg_content(msg)
            elif isinstance(msg, ToolMessage):
                t_name = getattr(msg, "name", "tool")
                tools_used.append(t_name)
                if t_name == "rag_tool":
                    try:
                        c_dict = json.loads(msg.content)
                        if isinstance(c_dict, dict) and "citations" in c_dict:
                            citations.extend(c_dict.get("citations", []))
                    except Exception:
                        pass

        return {
            "success": True,
            "thread_id": request.thread_id,
            "response": ai_response_text,
            "tools_used": tools_used,
            "citations": citations,
            "document_metadata": thread_document_metadata(request.thread_id)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LangGraph execution error: {str(e)}")

@app.post("/api/chat/stream")
def chat_stream(request: ChatRequest):
    """
    Server-Sent Events (SSE) Streaming endpoint for live token delivery to Express & React.
    """
    config = {
        "configurable": {"thread_id": str(request.thread_id)},
        "metadata": {"thread_id": str(request.thread_id)},
        "run_name": "chat_turn"
    }

    def sse_event_generator():
        try:
            for message_chunk, _ in chatbot.stream(
                {"messages": [HumanMessage(content=request.message)]},
                config=config,
                stream_mode="messages"
            ):
                if isinstance(message_chunk, ToolMessage):
                    tool_name = getattr(message_chunk, "name", "tool")
                    event_data = {
                        "type": "tool",
                        "tool_name": tool_name
                    }
                    if tool_name == "rag_tool":
                        try:
                            content_dict = json.loads(message_chunk.content)
                            if isinstance(content_dict, dict) and "citations" in content_dict:
                                event_data["citations"] = content_dict.get("citations", [])
                        except Exception:
                            pass
                    yield f"data: {json.dumps(event_data)}\n\n"

                elif isinstance(message_chunk, AIMessage):
                    content = message_chunk.content
                    text_chunk = ""
                    if isinstance(content, str):
                        text_chunk = content
                    elif isinstance(content, list):
                        for part in content:
                            if isinstance(part, dict) and part.get("type") == "text":
                                text_chunk += part.get("text", "")

                    if text_chunk:
                        event_data = {
                            "type": "text",
                            "chunk": text_chunk
                        }
                        yield f"data: {json.dumps(event_data)}\n\n"

            # End of stream signal
            yield "data: {\"type\": \"done\"}\n\n"

        except Exception as err:
            err_data = {
                "type": "error",
                "error": str(err)
            }
            yield f"data: {json.dumps(err_data)}\n\n"

    return StreamingResponse(sse_event_generator(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("py_api:app", host="0.0.0.0", port=8000, reload=True)
