import React from 'react';
import { AgentPin } from '../types';
import { CloseIcon, PinIcon } from './icons';

interface ArcTrayProps {
  pins: AgentPin[];
  isOpen: boolean;
  onSelectPin: (pin: AgentPin) => void;
  onDeletePin: (pinId: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export const ArcTray: React.FC<ArcTrayProps> = ({
  pins,
  isOpen,
  onSelectPin,
  onDeletePin,
  onClearAll,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="arc-tray" onClick={(e) => e.stopPropagation()}>
      <div className="arc-tray-header">
        <div className="arc-tray-title">
          <PinIcon size={13} />
          <span>Active Pins</span>
          <span className="arc-badge">{pins.length}</span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {pins.length > 0 && (
            <button
              type="button"
              className="arc-btn"
              style={{ height: '24px', padding: '0 8px', fontSize: '11px' }}
              onClick={onClearAll}
            >
              Clear All
            </button>
          )}
          <button
            type="button"
            className="arc-btn-icon"
            style={{ width: '24px', height: '24px' }}
            onClick={onClose}
          >
            <CloseIcon size={12} />
          </button>
        </div>
      </div>

      <div className="arc-tray-list">
        {pins.length === 0 ? (
          <div style={{ padding: '24px 12px', textAlign: 'center', color: '#71717A', fontSize: '12px' }}>
            No pins yet. Press &ldquo;Pin&rdquo; (or hit C) to inspect an element.
          </div>
        ) : (
          pins.map((pin) => {
            const comp = pin.metadata.componentName
              ? `<${pin.metadata.componentName}>`
              : `<${pin.metadata.tagName}>`;

            return (
              <div
                key={pin.id}
                className="arc-tray-item"
                onClick={() => {
                  pin.targetElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  onSelectPin(pin);
                }}
              >
                <div className="arc-tray-item-left">
                  <div className="arc-tray-pin-num">{pin.number}</div>
                  <div className="arc-tray-item-content">
                    <div className="arc-tray-item-meta">
                      {comp} • {pin.metadata.sourceFile || pin.metadata.selector}
                    </div>
                    <div className="arc-tray-item-text">
                      {pin.instruction || <em>(No instruction provided)</em>}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="arc-btn-icon"
                  style={{ width: '24px', height: '24px', flexShrink: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePin(pin.id);
                  }}
                  title="Delete pin"
                >
                  <CloseIcon size={11} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
