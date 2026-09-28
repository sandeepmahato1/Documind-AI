import React from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  GitCompare, 
  Search, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  PlusCircle
} from 'lucide-react';

export default function Sidebar({ activePage, setActivePage, isCollapsed, setIsCollapsed }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Sparkles, badge: null },
    { id: 'chat', label: 'Research Chat', icon: MessageSquare, badge: 'Live' },
    { id: 'comparison', label: 'Paper Comparison', icon: GitCompare, badge: null },
    { id: 'gap-analysis', label: 'Gap Analysis', icon: Search, badge: null },
    { id: 'claim-verification', label: 'Claim Verification', icon: CheckCircle2, badge: null },
    { id: 'literature-review', label: 'Literature Review', icon: BookOpen, badge: null },
    { id: 'history', label: 'Workspace History', icon: Clock, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <aside 
      style={{
        width: isCollapsed ? '72px' : '260px',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Brand Header */}
      <div style={{
        padding: '20px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#1E1B4B', lineHeight: '1.2' }}>DocuMind AI</h1>
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Smart Research Assistant</span>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Sparkles size={20} />
          </div>
        )}

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '6px',
            cursor: 'pointer',
            color: 'var(--purple-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* New Research Action Button */}
      <div style={{ padding: '16px' }}>
        <button 
          onClick={() => setActivePage('chat')}
          className="gradient-btn"
          style={{
            width: '100%',
            padding: isCollapsed ? '12px 0' : '10px 14px',
            borderRadius: '12px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <PlusCircle size={18} />
          {!isCollapsed && <span>New Workspace</span>}
        </button>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                style={{
                  width: '100%',
                  padding: isCollapsed ? '12px 0' : '10px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--purple-subtle)' : 'transparent',
                  color: isActive ? 'var(--purple-primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={18} color={isActive ? '#7C3AED' : '#6B7280'} />
                {!isCollapsed && (
                  <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span className="badge-purple" style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '999px', fontWeight: '700' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer Profile Preview */}
      {!isCollapsed && (
        <div style={{
          padding: '16px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: 'var(--bg-subtle)',
          margin: '12px',
          borderRadius: '12px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #F97316 0%, #7C3AED 100%)',
            color: 'white',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px'
          }}>
            SC
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#1E1B4B', margin: 0 }}>Dr. Sarah Chen</p>
            <p style={{ fontSize: '11px', color: '#6B7280', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>Senior Researcher</p>
          </div>
        </div>
      )}
    </aside>
  );
}
