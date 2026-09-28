import React from 'react';
import { BookOpen, Info, Sparkles, Download, FileText } from 'lucide-react';

export default function LiteratureReview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Banner */}
      <div style={{ padding: '14px 20px', borderRadius: '12px', backgroundColor: 'var(--blue-subtle)', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Info size={18} color="var(--blue-accent)" />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1E1B4B' }}>
            <strong>UI Visual Preview:</strong> Automated Literature Review Synthesis. Backend export engines will be connected in subsequent phases.
          </span>
        </div>
        <span className="badge-blue" style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', fontWeight: '700' }}>
          Frontend Phase 1 UI
        </span>
      </div>

      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1E1B4B', marginBottom: '4px' }}>
            Systematic Literature Review Workspace
          </h2>
          <p style={{ fontSize: '13px', color: '#6B7280' }}>
            Auto-generate comprehensive literature reviews with executive summaries, methodology synthesis, and references.
          </p>
        </div>

        <button className="gradient-btn" style={{ padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Download size={16} />
          <span>Export Review (Markdown / PDF)</span>
        </button>
      </div>

      {/* Draft Document View */}
      <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1E1B4B', borderBottom: '2px solid var(--purple-subtle)', paddingBottom: '12px' }}>
          Literature Review: Advances in Solid-State Battery Electrolyte Interfaces (2024-2026)
        </h3>

        <div style={{ fontSize: '14px', lineHeight: '1.7', color: '#374151' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1E1B4B', margin: '16px 0 8px' }}>1. Executive Summary</h4>
          <p style={{ marginBottom: '16px' }}>
            Solid-state battery safety and energy density hinged historically on suppressing lithium dendrite propagation across solid electrolytes. Recent advances in 2025 and 2026 highlight a strategic pivot from purely ceramic interfaces toward fluorinated composite interlayers.
          </p>

          <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1E1B4B', margin: '16px 0 8px' }}>2. Interfacial Engineering & Mechanical Suppression</h4>
          <p style={{ marginBottom: '16px' }}>
            Chen et al. (2025) demonstrated that in-situ formation of 5nm LiF interlayers elevates the critical current density (CCD) to 4.2 mA/cm². Conversely, Rodriguez & Zhang (2024) emphasized mechanical stiffness requirements, establishing that polymer binder shear moduli must exceed 18 GPa to mechanically deflect dendrites.
          </p>

          <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1E1B4B', margin: '16px 0 8px' }}>3. Future Recommendations</h4>
          <p>
            Combining fluorinated chemistry with high-modulus ceramic filler matrices presents the most viable path toward commercial pouch cell scaling above 500 Wh/kg.
          </p>
        </div>
      </div>

    </div>
  );
}
