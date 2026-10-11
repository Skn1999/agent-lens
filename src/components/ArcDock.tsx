import React, { useState } from 'react';
import { LensIcon, PinIcon, ListIcon, CopyIcon, CheckIcon, CloseIcon, FreezeIcon } from './icons';

interface ArcDockProps {
  isInspectActive: boolean;
  pinCount: number;
  isTrayOpen: boolean;
  freezeCountdown: number | null;
  onToggleInspect: () => void;
  onToggleTray: () => void;
  onTriggerFreeze: () => void;
  onCopyPrompt: () => void;
}

export const ArcDock: React.FC<ArcDockProps> = ({
  isInspectActive,
  pinCount,
  isTrayOpen,
  freezeCountdown,
  onToggleInspect,
  onToggleTray,
  onTriggerFreeze,
  onCopyPrompt,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = () => {
    onCopyPrompt();
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2200);
  };

  // Prevent pointerdown from stealing focus or triggering outside-click dismissals in page
  const preventDismiss = (e: React.PointerEvent | React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  // If inspection is active, tray is open, or countdown is running, automatically show expanded dock
  const shouldShowDock = isExpanded || isInspectActive || isTrayOpen || freezeCountdown !== null;

  if (!shouldShowDock) {
    return (
      <button
        type="button"
        className="arc-launcher-btn"
        onPointerDown={preventDismiss}
        onClick={() => setIsExpanded(true)}
        title="Open AgentLens (Hotkey: C or Option+C)"
      >
        <LensIcon size={20} />
        {pinCount > 0 && <span className="arc-launcher-badge">{pinCount}</span>}
      </button>
    );
  }

  return (
    <div className="arc-dock" onPointerDown={preventDismiss}>
      {/* Brand Pill */}
      <div className="arc-brand-pill">
        <span className="arc-brand-dot" />
        <span>AgentLens</span>
      </div>

      {/* Inspect & Pin Toggle */}
      <button
        type="button"
        className={`arc-btn ${isInspectActive ? 'arc-btn-active' : ''}`}
        onPointerDown={preventDismiss}
        onClick={onToggleInspect}
        title="Inspect element (Hotkey: C or Option+C)"
      >
        <PinIcon size={13} />
        <span>{isInspectActive ? 'Click Element...' : 'Pin'}</span>
      </button>

      {/* Freeze Timer for Popovers / Hovercards / Modals */}
      <button
        type="button"
        className={`arc-btn ${freezeCountdown !== null ? 'arc-btn-active' : ''}`}
        onPointerDown={preventDismiss}
        onClick={onTriggerFreeze}
        disabled={freezeCountdown !== null}
        title="3s Freeze countdown: open any popover or hover menu before inspection (Hotkey: Option+F)"
      >
        <FreezeIcon size={13} />
        <span>
          {freezeCountdown !== null ? `Freeze in ${freezeCountdown}s...` : 'Freeze (3s)'}
        </span>
      </button>

      {/* Pins Review Toggle */}
      <button
        type="button"
        className={`arc-btn ${isTrayOpen ? 'arc-btn-active' : ''}`}
        onPointerDown={preventDismiss}
        onClick={onToggleTray}
        title="Review active pins"
      >
        <ListIcon size={13} />
        <span>Pins</span>
        <span className="arc-badge">{pinCount}</span>
      </button>

      {/* Copy Prompt Button */}
      <button
        type="button"
        className={`arc-btn ${copied ? 'arc-btn-success' : 'arc-btn-gradient'}`}
        onPointerDown={preventDismiss}
        onClick={handleCopy}
        disabled={pinCount === 0}
        style={{
          opacity: pinCount === 0 ? 0.5 : 1,
          cursor: pinCount === 0 ? 'not-allowed' : 'pointer',
        }}
        title={pinCount === 0 ? 'Pin an element first' : 'Copy prompt for AI agent'}
      >
        {copied ? (
          <>
            <CheckIcon size={13} />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <CopyIcon size={13} />
            <span>Copy Prompt</span>
          </>
        )}
      </button>

      {/* Collapse button */}
      <button
        type="button"
        className="arc-btn-icon"
        style={{ width: '26px', height: '26px' }}
        onPointerDown={preventDismiss}
        onClick={() => setIsExpanded(false)}
        title="Collapse to bottom right"
      >
        <CloseIcon size={12} />
      </button>
    </div>
  );
};
