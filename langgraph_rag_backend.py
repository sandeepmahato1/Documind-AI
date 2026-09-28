from __future__ import annotations

import os
import sqlite3
import tempfile
from typing import Annotated, Any, Dict, Optional, TypedDict

from dotenv import load_dotenv
from langchain_core.messages import HumanMessage
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_community.vectorstores import FAISS
from langchain_core.messages import BaseMessage, SystemMessage
from langchain_core.tools import tool
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.graph import START, StateGraph
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
import requests

load_dotenv()

# -------------------
# 1. LLM + embeddings
# -------------------
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
embeddings = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001")

# -------------------
# 2. PDF retriever store (per thread)
# -------------------
_THREAD_STORES: Dict[str, FAISS] = {}
_THREAD_METADATA: Dict[str, dict] = {}


def _get_vector_store(thread_id: Optional[str]):
    """Fetch the FAISS vector store for a thread if available."""
    if thread_id and str(thread_id) in _THREAD_STORES:
        return _THREAD_STORES[str(thread_id)]
    return None


def ingest_pdf(file_bytes: bytes, thread_id: str, filename: Optional[str] = None) -> dict:
    """
    Build or update a multi-PDF FAISS vector store for the given thread.
    Stores source_file and 1-indexed page_number in chunk metadata.
    """
    if not file_bytes:
        raise ValueError("No bytes received for ingestion.")

    clean_filename = filename or f"document_{int(os.path.basename(tempfile.mktemp()))}.pdf"

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_file.write(file_bytes)
        temp_path = temp_file.name

    try:
        loader = PyPDFLoader(temp_path)
        docs = loader.load()

        # Attach source_file and 1-indexed page_number metadata to each raw page
        for doc in docs:
            raw_page = doc.metadata.get("page", 0)
            doc.metadata["source_file"] = clean_filename
            doc.metadata["page_number"] = raw_page + 1
            doc.metadata["doc_id"] = clean_filename

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=200, separators=["\n\n", "\n", " ", ""]
        )
        chunks = splitter.split_documents(docs)

        str_thread = str(thread_id)
        new_store = FAISS.from_documents(chunks, embeddings)

        if str_thread in _THREAD_STORES:
            _THREAD_STORES[str_thread].merge_from(new_store)
        else:
            _THREAD_STORES[str_thread] = new_store

        if str_thread not in _THREAD_METADATA:
            _THREAD_METADATA[str_thread] = {"files": [], "documents": 0, "chunks": 0}

        # Track file metadata list
        _THREAD_METADATA[str_thread]["files"].append({
            "filename": clean_filename,
            "documents": len(docs),
            "chunks": len(chunks)
        })
        _THREAD_METADATA[str_thread]["filename"] = clean_filename
        _THREAD_METADATA[str_thread]["documents"] += len(docs)
        _THREAD_METADATA[str_thread]["chunks"] += len(chunks)

        return {
            "filename": clean_filename,
            "documents": len(docs),
            "chunks": len(chunks),
            "total_files": len(_THREAD_METADATA[str_thread]["files"]),
            "total_chunks": _THREAD_METADATA[str_thread]["chunks"]
        }
    finally:
        try:
            os.remove(temp_path)
        except OSError:
            pass


# -------------------
# 3. Tools
# -------------------
search_tool = DuckDuckGoSearchRun(region="us-en")


@tool
def calculator(first_num: float, second_num: float, operation: str) -> dict:
    """
    Perform a basic arithmetic operation on two numbers.
    Supported operations: add, sub, mul, div
    """
    try:
        if operation == "add":
            result = first_num + second_num
        elif operation == "sub":
            result = first_num - second_num
        elif operation == "mul":
            result = first_num * second_num
        elif operation == "div":
            if second_num == 0:
                return {"error": "Division by zero is not allowed"}
            result = first_num / second_num
        else:
            return {"error": f"Unsupported operation '{operation}'"}

        return {
            "first_num": first_num,
            "second_num": second_num,
            "operation": operation,
            "result": result,
        }
    except Exception as e:
        return {"error": str(e)}


@tool
def get_stock_price(symbol: str) -> dict:
    """
    Fetch latest stock price for a given symbol (e.g. 'AAPL', 'TSLA') 
    using Alpha Vantage API.
    """
    api_key = os.getenv("ALPHA_VANTAGE_API_KEY", "demo")
    url = (
        "https://www.alphavantage.co/query"
        f"?function=GLOBAL_QUOTE&symbol={symbol}&apikey={api_key}"
    )
    r = requests.get(url)
    return r.json()


@tool
def rag_tool(query: str, thread_id: Optional[str] = None) -> dict:
    """
    Retrieve relevant information and page-level passages from all uploaded PDFs for this chat thread.
    Always include the thread_id when calling this tool.
    """
    str_thread = str(thread_id) if thread_id else None
    vector_store = _get_vector_store(str_thread)
    if vector_store is None:
        return {
            "error": "No documents indexed for this chat thread. Upload a PDF first.",
            "query": query,
            "citations": []
        }

    results = vector_store.similarity_search(query, k=6)

    citations = []
    formatted_contexts = []
    seen_snippets = set()

    for doc in results:
        src_file = doc.metadata.get("source_file", "Document.pdf")
        page_num = doc.metadata.get("page_number", doc.metadata.get("page", 0) + 1)
        text_snippet = doc.page_content.strip()

        # Deduplication check
        snippet_key = f"{src_file}_p{page_num}_{text_snippet[:80]}"
        if snippet_key in seen_snippets:
            continue
        seen_snippets.add(snippet_key)

        citation_tag = f"[{src_file}, p. {page_num}]"
        citations.append({
            "source_file": src_file,
            "page_number": page_num,
            "citation": citation_tag,
            "excerpt": text_snippet
        })

        formatted_contexts.append(
            f"Passage (Source: {citation_tag}):\n{text_snippet}"
        )

    if not citations:
        return {
            "query": query,
            "context": "No relevant document passages found.",
            "citations": []
        }

    return {
        "query": query,
        "context": "\n\n".join(formatted_contexts),
        "citations": citations,
        "total_citations": len(citations)
    }


tools = [rag_tool, search_tool, get_stock_price, calculator]
llm_with_tools = llm.bind_tools(tools)

# -------------------
# 4. State
# -------------------
class ChatState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]


# -------------------
# 5. Nodes
# -------------------
def chat_node(state: ChatState, config=None):
    """LLM node that enforces evidence-based answering with page-level citations."""
    thread_id = None
    if config and isinstance(config, dict):
        thread_id = config.get("configurable", {}).get("thread_id")

    has_docs = thread_has_document(str(thread_id)) if thread_id else False

    if has_docs:
        system_content = (
            "You are DocuMind AI, an evidence-based document research assistant. "
            f"Documents are currently loaded in the workspace for thread_id '{thread_id}'.\n\n"
            f"MANDATORY RULE: For any question asked by the user, you MUST ALWAYS call the `rag_tool` with thread_id='{thread_id}'. DO NOT use `duckduckgo_search` or web search when documents are loaded in the thread.\n\n"
            "Strict Grounding & Citation Rules:\n"
            "1. Base your answer strictly on evidence retrieved from the documents via `rag_tool`.\n"
            "2. Whenever stating facts or information, append exact inline citations in the format `[Document Name, p. X]` matching the retrieved passages.\n"
            "3. If the retrieved document passages do NOT contain sufficient evidence or information to answer the question, state clearly: 'The uploaded documents do not contain sufficient evidence to answer this question.' Do NOT invent answers, page numbers, or citations.\n"
            "4. Preserve follow-up conversation context."
        )
    else:
        system_content = (
            "You are DocuMind AI, a helpful research assistant. "
            "No documents are currently indexed for this thread. Ask the user to upload PDF documents if they wish to query documents. "
            "You may use web search, stock price, or calculator tools when helpful."
        )

    system_message = SystemMessage(content=system_content)
    messages = [system_message, *state["messages"]]
    response = llm_with_tools.invoke(messages, config=config)
    return {"messages": [response]}


tool_node = ToolNode(tools)

# -------------------
# 6. Checkpointer
# -------------------
conn = sqlite3.connect(database="chatbot.db", check_same_thread=False)
checkpointer = SqliteSaver(conn=conn)

# -------------------
# 7. Graph
# -------------------
graph = StateGraph(ChatState)
graph.add_node("chat_node", chat_node)
graph.add_node("tools", tool_node)

graph.add_edge(START, "chat_node")
graph.add_conditional_edges("chat_node", tools_condition)
graph.add_edge("tools", "chat_node")

chatbot = graph.compile(checkpointer=checkpointer)

# -------------------
# 8. Helpers
# -------------------
def retrieve_all_threads():
    all_threads = set()
    for checkpoint in checkpointer.list(None):
        all_threads.add(checkpoint.config["configurable"]["thread_id"])
    return list(all_threads)


def thread_has_document(thread_id: str) -> bool:
    return str(thread_id) in _THREAD_STORES


def thread_document_metadata(thread_id: str) -> dict:
    return _THREAD_METADATA.get(str(thread_id), {})


def remove_document(thread_id: str) -> bool:
    """Clear FAISS vector store and document metadata for a thread."""
    str_id = str(thread_id)
    removed = False
    if str_id in _THREAD_STORES:
        del _THREAD_STORES[str_id]
        removed = True
    if str_id in _THREAD_METADATA:
        del _THREAD_METADATA[str_id]
        removed = True
    return removed


def get_thread_title(thread_id: str):
    state = chatbot.get_state(
        config={"configurable": {"thread_id": str(thread_id)}}
    )

    messages = state.values.get("messages", [])

    for msg in messages:
        if isinstance(msg, HumanMessage):
            text = msg.content

            if isinstance(text, str):
                return text[:50] + ("..." if len(text) > 50 else "")

    return "New Chat"
