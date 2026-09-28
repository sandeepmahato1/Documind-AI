import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  FileText, 
  CheckCircle, 
  RefreshCw,
  UploadCloud,
  AlertCircle,
  Trash2,
  FileCheck,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Bookmark,
  ExternalLink
} from 'lucide-react';
import { fetchThreads, fetchThreadMessages, uploadPDF, fetchDocuments, deleteDocumentAPI, streamChatTurn } from '../services/apiService';

export default function ChatPage() {
  const [threadId, setThreadId] = useState(() => `thread-${Date.now()}`);
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeToolStatus, setActiveToolStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Evidence panel state
  const [expandedCitations, setExpandedCitations] = useState({});
  const [activeEvidenceModal, setActiveEvidenceModal] = useState(null);

  const exampleQuestions = [
    "Summarize the key findings from all uploaded research PDFs.",
    "Calculate 128 * 4.5 using calculator tool",
    "What is the stock price of TSLA?"
  ];

  useEffect(() => {
    loadThreadsList();
  }, []);

  useEffect(() => {
    if (threadId) {
      loadMessagesForThread(threadId);
      loadDocumentsForThread(threadId);
    }
  }, [threadId]);

  const loadThreadsList = async () => {
    const threadList = await fetchThreads();
    setThreads(threadList);
  };

  const loadDocumentsForThread = async (tId) => {
    const docList = await fetchDocuments(tId);
    setDocuments(docList);
  };

  const loadMessagesForThread = async (tId) => {
    setErrorMessage(null);
    const data = await fetchThreadMessages(tId);
    if (data.messages) {
      setMessages(data.messages.map((m, idx) => ({
        id: `msg-${idx}`,
        role: m.role,
        content: m.content,
        citations: m.citations || []
      })));
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setErrorMessage(null);
    setIsProcessing(true);

    try {
      for (const file of files) {
        await uploadPDF(threadId, file);
      }
      await loadDocumentsForThread(threadId);
    } catch (err) {
      setErrorMessage(`PDF Upload Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm("Are you sure you want to remove this PDF from the vector store?")) return;

    try {
      await deleteDocumentAPI(docId);
      await loadDocumentsForThread(threadId);
    } catch (err) {
      setErrorMessage(`Could not remove document: ${err.message}`);
    }
  };

  const toggleCitations = (msgId) => {
    setExpandedCitations(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userText = input.trim();
    setInput('');
    setErrorMessage(null);

    const userMsg = { id: `usr-${Date.now()}`, role: 'user', content: userText };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);
    setActiveToolStatus(null);

    const aiMsgId = `ai-${Date.now()}`;
    let aiText = '';
    let currentCitations = [];

    setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: '', citations: [] }]);

    await streamChatTurn(
      threadId,
      userText,
      (chunk) => {
        aiText += chunk;
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: aiText } : m));
      },
      (toolName, citations) => {
        setActiveToolStatus(toolName);
        if (citations && citations.length > 0) {
          currentCitations = citations;
          setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, citations: currentCitations } : m));
        }
      },
      (err) => {
        setErrorMessage(`Execution Error: ${err}`);
        setIsProcessing(false);
      },
      () => {
        setIsProcessing(false);
        setActiveToolStatus(null);
        loadThreadsList();
      }
    );
  };

  const renderContentWithCitations = (content, citations, msgId) => {
    if (!content) return null;

    // Pattern for inline citations like [filename.pdf, p. 5]
    const citationRegex = /\[([^\]]+?),\s*p\.\s*(\d+)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = citationRegex.exec(content)) !== null) {
      const precedingText = content.substring(lastIndex, match.index);
      if (precedingText) {
        parts.push(precedingText);
      }

      const docName = match[1];
      const pageNum = match[2];
      const fullCitation = match[0];

      parts.push(
        <button
          key={`cite-${match.index}`}
          onClick={() => {
            setExpandedCitations(prev => ({ ...prev, [msgId]: true }));
            setActiveEvidenceModal({ docName, pageNum, fullCitation, citations });
          }}
          title={`Click to inspect evidence chunk from ${docName}, Page ${pageNum}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            margin: '0 3px',
            padding: '2px 8px',
            borderRadius: '6px',
            backgroundColor: 'var(--purple-subtle)',
            color: 'var(--purple-primary)',
            border: '1px solid #DDD6FE',
            fontWeight: '700',
            fontSize: '11px',
            cursor: 'pointer',
            verticalAlign: 'baseline',
            transition: 'all 0.15s ease'
          }}
        >
          <Bookmark size={11} />
          <span>{docName}, p. {pageNum}</span>
        </button>
      );

      lastIndex = citationRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', height: 'calc(100vh - 112px)' }}>
      
      {/* 1. Left Sidebar: Multi-PDF Documents & Threads */}
      <div className="glass-panel" style={{ borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1E1B4B', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} color="var(--purple-primary)" />
            Multi-PDF Workspace ({documents.length})
          </h3>
        </div>

        {/* Uploaded PDF List */}
        <div style={{ padding: '12px', flex: 1, overflowY: 'auto' }}>
          {documents.length === 0 ? (
            <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: '#6B7280' }}>No PDFs indexed in workspace.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {documents.map((doc) => (
                <div key={doc._id || doc.id} style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'white', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ overflow: 'hidden', paddingRight: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FileCheck size={14} color="var(--emerald-accent)" />
                      <h5 style={{ fontSize: '12px', fontWeight: '700', color: '#1E1B4B', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {doc.originalFilename || doc.filename}
                      </h5>
                    </div>
                    <span style={{ fontSize: '10px', color: '#6B7280', display: 'block' }}>
                      {doc.chunksCount || doc.chunks || 0} vector chunks ({doc.pageCount || doc.documents || 0} pages)
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDeleteDocument(doc._id || doc.id)}
                    style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                    title="Remove Document Index"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Dropzone */}
          <label style={{
            marginTop: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            border: '2px dashed var(--border-color)',
            borderRadius: '12px',
            padding: '14px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}>
            <UploadCloud size={22} color="var(--purple-primary)" />
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#1E1B4B' }}>Upload Multiple PDFs</span>
            <input type="file" accept="application/pdf" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Thread History Selector */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--border-subtle)', height: '180px', overflowY: 'auto' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Saved Threads ({threads.length})
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {threads.map((t) => (
              <button
                key={t.thread_id}
                onClick={() => setThreadId(t.thread_id)}
                style={{
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: threadId === t.thread_id ? 'var(--purple-subtle)' : 'transparent',
                  color: threadId === t.thread_id ? 'var(--purple-primary)' : '#4B5563',
                  fontWeight: threadId === t.thread_id ? '700' : '500',
                  fontSize: '11px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap'
                }}
              >
                💬 {t.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Chat Area */}
      <div className="glass-panel" style={{ borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1E1B4B' }}>Evidence-Based Multi-PDF RAG</h3>
            <span style={{ fontSize: '11px', color: '#6B7280' }}>Thread ID: `{threadId}`</span>
          </div>
          <span className="badge-purple" style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '999px', fontWeight: '600' }}>
            Page-Level Citations Enabled
          </span>
        </div>

        {/* Messages View */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {errorMessage && (
            <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {messages.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', maxWidth: '480px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'var(--purple-subtle)', color: 'var(--purple-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Sparkles size={26} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', marginBottom: '8px' }}>
                Multi-PDF RAG & Citation Engine
              </h3>
              <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>
                Query multiple research PDFs with page-level citations and grounded evidence verification.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {exampleQuestions.map((q, idx) => (
                  <button key={idx} onClick={() => setInput(q)} style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'white', textAlign: 'left', fontSize: '13px', cursor: 'pointer' }}>
                    💡 "{q}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === 'user';
              const hasCitations = msg.citations && msg.citations.length > 0;
              const isExpanded = expandedCitations[msg.id];

              return (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', maxWidth: '85%', alignSelf: isUser ? 'flex-end' : 'flex-start' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: isUser ? 'var(--purple-primary)' : '#4B5563', marginBottom: '4px' }}>
                    {isUser ? 'You' : 'DocuMind AI Agent'}
                  </span>
                  
                  {/* Message Bubble */}
                  <div style={{
                    padding: '14px 18px',
                    borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    backgroundColor: isUser ? 'var(--purple-primary)' : 'white',
                    color: isUser ? 'white' : '#1E1B4B',
                    border: isUser ? 'none' : '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-line'
                  }}>
                    {isUser ? msg.content : (renderContentWithCitations(msg.content, msg.citations, msg.id) || (isProcessing ? 'Thinking...' : ''))}
                  </div>

                  {/* Expandable Evidence Panel Button for Assistant Messages */}
                  {!isUser && hasCitations && (
                    <div style={{ marginTop: '6px', width: '100%' }}>
                      <button
                        onClick={() => toggleCitations(msg.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'none',
                          border: 'none',
                          color: 'var(--purple-primary)',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          padding: '4px 0'
                        }}
                      >
                        <BookOpen size={14} />
                        <span>{isExpanded ? 'Hide Supporting Evidence' : `View Evidence Sources (${msg.citations.length} passages)`}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      {/* Expanded Evidence Cards */}
                      {isExpanded && (
                        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)' }}>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase' }}>
                            Retrieved Document Evidence ({msg.citations.length})
                          </span>
                          {msg.citations.map((cite, cIdx) => (
                            <div key={cIdx} style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'white', border: '1px solid var(--border-color)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E1B4B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <FileText size={14} color="var(--purple-primary)" />
                                  {cite.source_file}
                                </span>
                                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--purple-primary)', backgroundColor: 'var(--purple-subtle)', padding: '2px 8px', borderRadius: '6px' }}>
                                  Page {cite.page_number}
                                </span>
                              </div>
                              <p style={{ fontSize: '12px', color: '#4B5563', fontStyle: 'italic', lineHeight: '1.4', margin: 0 }}>
                                "{cite.excerpt}"
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })
          )}

          {activeToolStatus && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', backgroundColor: 'var(--purple-subtle)', color: 'var(--purple-primary)', width: 'fit-content', fontSize: '12px', fontWeight: '600' }}>
              <RefreshCw size={14} style={{ animation: 'spin 1.5s linear infinite' }} />
              <span>🔧 Executing Tool: `{activeToolStatus}`...</span>
            </div>
          )}
        </div>

        {/* Input Controls */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '8px 14px' }}>
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question across workspace PDFs with citations..."
              style={{ flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '14px', color: '#1E1B4B' }}
            />
            <button onClick={handleSend} disabled={isProcessing} className="gradient-btn" style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{isProcessing ? 'Sending' : 'Send'}</span>
              <Send size={14} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

