import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { AgentLens } from '../src';

const DemoApp: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div style={{ maxWidth: 860, margin: '60px auto', padding: '0 24px' }}>
      <header style={{ marginBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
          AgentLens Playground
        </h1>
        <p style={{ margin: 0, color: '#a1a1aa', fontSize: 15, lineHeight: 1.5 }}>
          Figma-style visual review canvas designed for AI coding agents. Click the Loom-style trigger in the bottom-right or press <code>Option + C</code> to inspect and pin.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 40 }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 18 }}>Interactive Hero Card</h3>
          <p style={{ color: '#a1a1aa', fontSize: 14, margin: '0 0 16px 0' }}>
            Test pinning buttons, text snippets, and responsive layout boxes.
          </p>
          <button
            type="button"
            style={{
              background: '#38bdf8',
              color: '#000',
              fontWeight: 600,
              border: 'none',
              padding: '10px 18px',
              borderRadius: 9999,
              cursor: 'pointer',
            }}
          >
            Primary Action
          </button>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, position: 'relative' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 18 }}>Dropdown &amp; Popover Test</h3>
          <p style={{ color: '#a1a1aa', fontSize: 14, margin: '0 0 16px 0' }}>
            Open this dropdown, then press <code>Option + C</code> or click the launcher to test event shielding.
          </p>
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '10px 18px',
              borderRadius: 12,
              cursor: 'pointer',
            }}
          >
            {dropdownOpen ? 'Close Menu' : 'Open Dropdown'}
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 24,
                marginTop: 8,
                background: '#1c1c22',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 12,
                padding: 8,
                boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
                minWidth: 180,
                zIndex: 10,
              }}
            >
              <div style={{ padding: '8px 12px', fontSize: 13, cursor: 'pointer', borderRadius: 8 }}>Profile Settings</div>
              <div style={{ padding: '8px 12px', fontSize: 13, cursor: 'pointer', borderRadius: 8 }}>API Tokens</div>
              <div style={{ padding: '8px 12px', fontSize: 13, cursor: 'pointer', borderRadius: 8, color: '#ef4444' }}>Sign Out</div>
            </div>
          )}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 18 }}>Modal Dialog Test</h3>
          <p style={{ color: '#a1a1aa', fontSize: 14, margin: '0 0 16px 0' }}>
            Open modal dialog and test pin anchoring inside an overlay layer.
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            style={{
              background: 'rgba(168, 85, 247, 0.2)',
              color: '#c084fc',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              padding: '10px 18px',
              borderRadius: 12,
              cursor: 'pointer',
            }}
          >
            Open Modal
          </button>
        </div>
      </section>

      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              background: '#18181b',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 20,
              padding: 28,
              width: 380,
              maxWidth: '90vw',
              boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 12px 0', fontSize: 20 }}>Modal Dialog</h2>
            <p style={{ color: '#a1a1aa', fontSize: 14, margin: '0 0 20px 0', lineHeight: 1.5 }}>
              Try pressing <code>Option + C</code> right now to pin this modal element!
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 10,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  background: '#a855f7',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 10,
                  cursor: 'pointer',
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AgentLens DevTool */}
      <AgentLens />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<DemoApp />);
