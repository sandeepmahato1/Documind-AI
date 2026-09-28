import React from 'react';
import { Search, Bell, Sparkles, FolderKanban, ShieldCheck } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Research Intelligence Dashboard';
      case 'chat': return 'Interactive Research Chat & RAG Workspace';
      case 'comparison': return 'Multi-Paper Comparative Analysis Matrix';
      case 'gap-analysis': return 'Literature Gap & Hypothesis Discovery';
      case 'claim-verification': return 'Automated Scientific Claim Verification';
      case 'literature-review': return 'Systematic Literature Review Generator';
      case 'history': return 'Workspace Session History';
      case 'settings': return 'Platform & Engine Configuration';
      default: return 'DocuMind AI Workspace';
    }
  };

  return (
    <header style={{
      height: '64px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Title & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1E1B4B' }}>
          {getPageTitle()}
        </h2>
        <span className="badge-purple" style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '999px', fontWeight: '600' }}>
          DocuMind AI v2.0
        </span>
      </div>

      {/* Right Action Items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Search Bar */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: '240px'
        }}>
          <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px' }} />
          <input 
            type="text"
            placeholder="Search papers, claims, tags..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-main)',
              fontSize: '13px',
              outline: 'none',
              color: '#1E1B4B'
            }}
          />
        </div>

        {/* Workspace Quick Toggle */}
        <button 
          onClick={() => setActivePage('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--purple-primary)',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <FolderKanban size={16} />
          <span>Workspaces</span>
        </button>

        {/* Notifications */}
        <button style={{
          position: 'relative',
          padding: '8px',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-card)',
          cursor: 'pointer',
          color: '#6B7280'
        }}>
          <Bell size={18} />
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--coral-accent)'
          }}></span>
        </button>
      </div>
    </header>
  );
}
