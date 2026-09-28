import React from 'react';
import { Search, Info, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function GapAnalysis() {
  const mockGaps = [
    {
      id: 1,
      topic: "High-Temperature Thermal Runaway in Sulfide Electrolytes",
      confidence: "High Priority (94%)",
      description: "No current indexed papers evaluate dendrite growth mechanics above 60°C under continuous 5C rapid charging conditions.",
      suggestedHypothesis: "Introduce ceramic nano-fillers to stabilize polymer phase transitions up to 85°C."
    },
    {
      id: 2,
      topic: "Long-Term Degradation of Fluorinated Interface Layers",
      confidence: "Medium Priority (82%)",
      description: "Existing studies limit cycling observations to 500 cycles; interfacial resistance degradation after 1500+ cycles remains uncharacterized.",
      suggestedHypothesis: "In-situ self-healing dynamic interphases via organosilicon additives."
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Banner */}
      <div style={{ padding: '14px 20px', borderRadius: '12px', backgroundColor: 'var(--coral-subtle)', border: '1px solid #FFEDD5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Info size={18} color="var(--coral-accent)" />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1E1B4B' }}>
            <strong>UI Visual Preview:</strong> Automated Literature Gap & Hypothesis Discovery. Backend logic will be connected in Phase 2.
          </span>
        </div>
        <span className="badge-coral" style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', fontWeight: '700' }}>
          Frontend Phase 1 UI
        </span>
      </div>

      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1E1B4B', marginBottom: '4px' }}>
            Research Gap & Hypothesis Finder
          </h2>
          <p style={{ fontSize: '13px', color: '#6B7280' }}>
            Uncover unaddressed research questions and generate novel experimental hypotheses across your paper collection.
          </p>
        </div>

        <button className="gradient-btn" style={{ padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} />
          <span>Scan For New Gaps</span>
        </button>
      </div>

      {/* Gap Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {mockGaps.map((gap) => (
          <div key={gap.id} className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={20} color="var(--coral-accent)" />
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E1B4B' }}>{gap.topic}</h3>
              </div>
              <span className="badge-coral" style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '700' }}>
                {gap.confidence}
              </span>
            </div>

            <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: '1.6', marginBottom: '14px' }}>
              {gap.description}
            </p>

            <div style={{ backgroundColor: 'var(--bg-main)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--purple-primary)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                💡 Suggested Novel Research Hypothesis
              </span>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#1E1B4B', margin: 0 }}>
                {gap.suggestedHypothesis}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
