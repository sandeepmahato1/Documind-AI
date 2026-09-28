import React from 'react';
import { GitCompare, Info, Check, Sparkles, Layers } from 'lucide-react';
import { mockComparisonMatrix, mockUploadedPapers } from '../data/mockData';

export default function PaperComparison() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Backend Status Banner */}
      <div style={{
        padding: '14px 20px',
        borderRadius: '12px',
        backgroundColor: 'var(--purple-subtle)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Info size={18} color="var(--purple-primary)" />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1E1B4B' }}>
            <strong>UI Visual Preview:</strong> Interactive Paper Matrix Comparison. Backend API integration will be wired in Phase 2.
          </span>
        </div>
        <span className="badge-purple" style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', fontWeight: '700' }}>
          Frontend Phase 1 UI
        </span>
      </div>

      {/* Header & Controls */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1E1B4B', marginBottom: '4px' }}>
            Multi-Paper Comparative Matrix
          </h2>
          <p style={{ fontSize: '13px', color: '#6B7280' }}>
            Automatically extract and compare experimental parameters, metrics, and conclusions across papers.
          </p>
        </div>

        <button className="gradient-btn" style={{ padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} />
          <span>Generate New Matrix</span>
        </button>
      </div>

      {/* Matrix Table */}
      <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 20px', fontWeight: '700', color: '#1E1B4B', width: '22%' }}>Evaluation Metric</th>
              <th style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--purple-primary)', width: '26%' }}>Chen et al. (2025)</th>
              <th style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--blue-accent)', width: '26%' }}>Rodriguez et al. (2024)</th>
              <th style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--coral-accent)', width: '26%' }}>Synthesis Verdict</th>
            </tr>
          </thead>
          <tbody>
            {mockComparisonMatrix.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '16px 20px', fontWeight: '700', color: '#1E1B4B', backgroundColor: 'var(--bg-main)' }}>
                  {row.metric}
                </td>
                <td style={{ padding: '16px 20px', color: '#374151' }}>{row.paperA}</td>
                <td style={{ padding: '16px 20px', color: '#374151' }}>{row.paperB}</td>
                <td style={{ padding: '16px 20px' }}>
                  <span className="badge-purple" style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}>
                    {row.verdict}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
