import React from 'react';
import { CheckCircle2, Info, ShieldCheck, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';

export default function ClaimVerification() {
  const mockClaims = [
    {
      id: 1,
      claim: "Fluorinated interlayers elevate critical current density beyond 4.0 mA/cm² without short-circuiting.",
      status: "Verified True",
      confidence: "98% Match",
      supportingPaper: "Chen et al. (2025) — Nature Energy",
      evidence: "Experimental measurements confirmed CCD = 4.2 mA/cm² across 20 distinct pouch cell tests."
    },
    {
      id: 2,
      claim: "Polymer binders with shear modulus below 10 GPa mechanically prevent lithium dendrite growth.",
      status: "Contradicted",
      confidence: "92% Disproved",
      supportingPaper: "Rodriguez & Zhang (2024) — Advanced Materials",
      evidence: "FEA modeling proved shear modulus MUST exceed 18 GPa to mechanically deflect dendrites."
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Banner */}
      <div style={{ padding: '14px 20px', borderRadius: '12px', backgroundColor: 'var(--emerald-subtle)', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Info size={18} color="var(--emerald-accent)" />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1E1B4B' }}>
            <strong>UI Visual Preview:</strong> Automated Scientific Claim Verification & Evidence Checking. Backend integration in later phase.
          </span>
        </div>
        <span className="badge-emerald" style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', fontWeight: '700' }}>
          Frontend Phase 1 UI
        </span>
      </div>

      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1E1B4B', marginBottom: '4px' }}>
          Scientific Claim Verification
        </h2>
        <p style={{ fontSize: '13px', color: '#6B7280' }}>
          Verify scientific statements and claims against indexed PDF literature with source line citations.
        </p>
      </div>

      {/* Claims List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {mockClaims.map((item) => {
          const isVerified = item.status === 'Verified True';
          return (
            <div key={item.id} className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', maxWidth: '80%' }}>
                  {isVerified ? (
                    <CheckCircle2 size={24} color="var(--emerald-accent)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  ) : (
                    <XCircle size={24} color="var(--coral-accent)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  )}
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1E1B4B', lineHeight: '1.4' }}>
                      "{item.claim}"
                    </h3>
                    <span style={{ fontSize: '12px', color: 'var(--purple-primary)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      {item.supportingPaper} <ExternalLink size={12} />
                    </span>
                  </div>
                </div>

                <span className={isVerified ? "badge-emerald" : "badge-coral"} style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: '700' }}>
                  {item.status} ({item.confidence})
                </span>
              </div>

              <div style={{ backgroundColor: 'var(--bg-main)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '13px', color: '#374151' }}>
                <strong>Evidence Context:</strong> {item.evidence}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
