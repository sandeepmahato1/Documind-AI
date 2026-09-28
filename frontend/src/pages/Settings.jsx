import React from 'react';
import { Settings, Cpu, Database, Key, Shield, Save, Info } from 'lucide-react';

export default function WorkspaceSettings() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Banner */}
      <div style={{ padding: '14px 20px', borderRadius: '12px', backgroundColor: 'var(--purple-subtle)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Info size={18} color="var(--purple-primary)" />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1E1B4B' }}>
            <strong>UI Settings Preview:</strong> Configuration controls for LLM, vector store, and API endpoints.
          </span>
        </div>
        <span className="badge-purple" style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', fontWeight: '700' }}>
          Frontend Phase 1 UI
        </span>
      </div>

      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1E1B4B', marginBottom: '4px' }}>
            DocuMind AI Platform & Engine Settings
          </h2>
          <p style={{ fontSize: '13px', color: '#6B7280' }}>
            Manage LLM model selection, vector retrieval parameters, and API configuration.
          </p>
        </div>

        <button className="gradient-btn" style={{ padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={16} />
          <span>Save Settings</span>
        </button>
      </div>

      {/* Settings Form Groups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Model Selection */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Cpu size={20} color="var(--purple-primary)" />
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E1B4B' }}>LLM Engine & Model Selection</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Primary LLM Model</label>
            <select style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', fontSize: '14px', color: '#1E1B4B', outline: 'none' }}>
              <option value="gemini-3.1-flash-lite">Google Gemini 3.1 Flash Lite (Fast & Efficient)</option>
              <option value="gemini-2.5-flash">Google Gemini 2.5 Flash</option>
              <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (Deep Research)</option>
            </select>
          </div>
        </div>

        {/* Vector Store Parameters */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Database size={20} color="var(--blue-accent)" />
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E1B4B' }}>Vector Search & Retrieval Settings</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Top K Retrieved Chunks</label>
              <input type="number" defaultValue={4} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', fontSize: '14px' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Chunk Size (Characters)</label>
              <input type="number" defaultValue={1000} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', fontSize: '14px' }} />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
