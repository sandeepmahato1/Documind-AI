import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  BookOpen, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  GitCompare, 
  Search, 
  TrendingUp,
  Database,
  X
} from 'lucide-react';
import { fetchWorkspaces, createWorkspaceAPI } from '../services/apiService';

export default function Dashboard({ setActivePage }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newWsName, setNewWsName] = useState('');
  const [newWsDesc, setNewWsDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadWorkspacesData();
  }, []);

  const loadWorkspacesData = async () => {
    const data = await fetchWorkspaces();
    setWorkspaces(data);
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newWsName.trim()) return;

    setIsCreating(true);
    try {
      await createWorkspaceAPI(newWsName.trim(), newWsDesc.trim());
      setNewWsName('');
      setNewWsDesc('');
      setShowModal(false);
      await loadWorkspacesData();
    } catch (err) {
      alert(`Could not create workspace: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Banner / Welcome Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #3B82F6 100%)',
        borderRadius: '20px',
        padding: '32px',
        color: 'white',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '750px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.2)', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', marginBottom: '16px' }}>
            <Sparkles size={14} />
            <span>AI Evidence Intelligence Platform</span>
          </div>

          <h1 style={{ fontSize: '30px', fontWeight: '800', lineHeight: '1.2', marginBottom: '10px' }}>
            Welcome to DocuMind AI
          </h1>
          <p style={{ fontSize: '15px', opacity: 0.9, marginBottom: '24px', lineHeight: '1.6' }}>
            Accelerate literature synthesis, compare experimental methodologies, and extract verifiable evidence across your scientific research papers.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setShowModal(true)}
              style={{
                backgroundColor: 'white',
                color: '#7C3AED',
                fontWeight: '700',
                padding: '12px 22px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
              }}
            >
              <Plus size={18} />
              <span>Create New Workspace</span>
            </button>

            <button 
              onClick={() => setActivePage('chat')}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                fontWeight: '600',
                padding: '12px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px'
              }}
            >
              <BookOpen size={18} />
              <span>Launch Research Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>Persistent Workspaces</span>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'var(--purple-subtle)', color: 'var(--purple-primary)' }}>
              <BookOpen size={20} />
            </div>
          </div>
          <p style={{ fontSize: '28px', fontWeight: '800', color: '#1E1B4B' }}>{workspaces.length}</p>
          <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            MongoDB Database Connected
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>Multi-PDF Documents</span>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'var(--blue-subtle)', color: 'var(--blue-accent)' }}>
              <FileText size={20} />
            </div>
          </div>
          <p style={{ fontSize: '28px', fontWeight: '800', color: '#1E1B4B' }}>Active</p>
          <span style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px', display: 'block' }}>FAISS Vector RAG Engine</span>
        </div>
      </div>

      {/* Workspace List */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1E1B4B' }}>Research Workspaces</h3>
          <button 
            onClick={() => setShowModal(true)}
            style={{ background: 'none', border: 'none', color: 'var(--purple-primary)', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
          >
            + New Workspace
          </button>
        </div>

        {workspaces.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
            <BookOpen size={36} color="var(--purple-primary)" style={{ margin: '0 auto 12px', opacity: 0.8 }} />
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1E1B4B', marginBottom: '6px' }}>No Workspaces Created Yet</h4>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px' }}>Create a persistent research workspace to manage multi-PDF documents and RAG queries.</p>
            <button onClick={() => setShowModal(true)} className="gradient-btn" style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '13px', border: 'none', cursor: 'pointer' }}>
              Create Workspace
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {workspaces.map((ws) => (
              <div key={ws._id || ws.id} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1E1B4B' }}>{ws.name}</h4>
                    <span className="badge-purple" style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '999px', fontWeight: '700' }}>
                      {ws.status || 'Active'}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px', lineHeight: '1.5' }}>
                    {ws.description || 'No description provided.'}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '11px', color: '#9CA3AF' }}>MongoDB Record</span>
                  <button 
                    onClick={() => setActivePage('chat')}
                    className="gradient-btn"
                    style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                  >
                    Open Workspace
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Creating Workspace */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '440px', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1E1B4B' }}>Create Research Workspace</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateWorkspace} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Workspace Name</label>
                <input 
                  type="text" 
                  value={newWsName}
                  onChange={(e) => setNewWsName(e.target.value)}
                  placeholder="e.g. CRISPR Cas12 Micro-Review"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Description</label>
                <textarea 
                  value={newWsDesc}
                  onChange={(e) => setNewWsDesc(e.target.value)}
                  placeholder="Enter brief research objectives..."
                  rows={3}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '14px', outline: 'none', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white', cursor: 'pointer', fontSize: '13px' }}>
                  Cancel
                </button>
                <button type="submit" disabled={isCreating} className="gradient-btn" style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                  {isCreating ? 'Saving...' : 'Create Workspace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
