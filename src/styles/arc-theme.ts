/**
 * Arc UI CSS - Injected directly into the Shadow Root for complete isolation.
 * Strictly implements Arc Browser aesthetics: frosted obsidian glass, tactile pills,
 * luminous neon-pastel gradients, pure SVG line iconography, and zero emojis.
 */
export const ARC_THEME_CSS = `
:host {
  all: initial;
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  z-index: 2147483647;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #F4F4F5;
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Arc Design System Tokens */
:host {
  --arc-gradient: linear-gradient(135deg, #FF6EA7 0%, #A855F7 50%, #38BDF8 100%);
  --arc-gradient-subtle: linear-gradient(135deg, rgba(255, 110, 167, 0.12) 0%, rgba(168, 85, 247, 0.12) 50%, rgba(56, 189, 248, 0.12) 100%);
  --arc-cyan: #38BDF8;
  --arc-purple: #A855F7;
  --arc-pink: #FF6EA7;
  --arc-glass-bg: rgba(18, 18, 24, 0.88);
  --arc-glass-surface: rgba(28, 28, 36, 0.72);
  --arc-glass-hover: rgba(42, 42, 54, 0.85);
  --arc-border: rgba(255, 255, 255, 0.1);
  --arc-border-highlight: rgba(255, 255, 255, 0.22);
  --arc-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.08);
  --arc-shadow-hover: 0 20px 48px -8px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.18);
  --arc-radius-pill: 9999px;
  --arc-radius-card: 16px;
}

/* Loom / Intercom Floating Trigger Button (Bottom Right) */
.arc-launcher-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--arc-glass-bg);
  backdrop-filter: blur(28px) saturate(190%);
  -webkit-backdrop-filter: blur(28px) saturate(190%);
  border: 1px solid var(--arc-border);
  box-shadow: var(--arc-shadow);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  cursor: pointer;
  pointer-events: auto;
  user-select: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 2147483647;
}

.arc-launcher-btn:hover {
  transform: translateY(-2px) scale(1.04);
  border-color: var(--arc-border-highlight);
  box-shadow: var(--arc-shadow-hover);
}

.arc-launcher-btn:active {
  transform: translateY(0) scale(0.96);
}

.arc-launcher-badge {
  position: absolute;
  top: -3px;
  right: -3px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: var(--arc-radius-pill);
  background: var(--arc-gradient);
  color: #FFFFFF;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(168, 85, 247, 0.6);
}

/* Arc Expanded Dock / Toolbar (Docked at Bottom-Right) */
.arc-dock {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  background: var(--arc-glass-bg);
  backdrop-filter: blur(28px) saturate(190%);
  -webkit-backdrop-filter: blur(28px) saturate(190%);
  border: 1px solid var(--arc-border);
  border-radius: var(--arc-radius-pill);
  box-shadow: var(--arc-shadow);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: auto;
  user-select: none;
  z-index: 2147483647;
}

.arc-dock:hover {
  border-color: var(--arc-border-highlight);
  box-shadow: var(--arc-shadow-hover);
}

/* Brand Pill */
.arc-brand-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--arc-radius-pill);
  background: rgba(255, 255, 255, 0.04);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #FFFFFF;
}

.arc-brand-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--arc-gradient);
  box-shadow: 0 0 8px rgba(168, 85, 247, 0.8);
  animation: arc-pulse 2s infinite ease-in-out;
}

@keyframes arc-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}

/* Tactile Pill Buttons */
.arc-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  background: var(--arc-glass-surface);
  border: 1px solid var(--arc-border);
  border-radius: var(--arc-radius-pill);
  color: #D4D4D8;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  outline: none;
  user-select: none;
}

.arc-btn:hover {
  background: var(--arc-glass-hover);
  color: #FFFFFF;
  border-color: var(--arc-border-highlight);
  transform: translateY(-1px);
}

.arc-btn:active {
  transform: translateY(1px) scale(0.98);
}

.arc-btn-active {
  background: var(--arc-gradient);
  color: #FFFFFF;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 3px 12px rgba(168, 85, 247, 0.45);
}

.arc-btn-active:hover {
  filter: brightness(1.08);
}

.arc-btn-gradient {
  background: var(--arc-gradient);
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 3px 12px rgba(168, 85, 247, 0.35);
}

.arc-btn-gradient:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

.arc-btn-success {
  background: #10B981;
  color: #FFFFFF;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 3px 12px rgba(16, 185, 129, 0.4);
}

.arc-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 5px;
  border-radius: var(--arc-radius-pill);
  font-size: 10px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.12);
  color: #FFFFFF;
}

/* Hover Inspector Overlay */
.arc-inspect-box {
  position: fixed;
  pointer-events: none;
  z-index: 2147483640;
  border: 1.5px solid var(--arc-cyan);
  background: rgba(56, 189, 248, 0.06);
  border-radius: 4px;
  transition: all 0.08s ease-out;
  box-shadow: 0 0 16px rgba(56, 189, 248, 0.2);
}

.arc-inspect-label {
  position: absolute;
  top: -26px;
  left: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  background: rgba(14, 14, 18, 0.94);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(56, 189, 248, 0.5);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--arc-cyan);
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.arc-inspect-label .size {
  color: #A1A1AA;
  font-weight: 400;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 10px;
}

/* Numbered Pin Badges */
.arc-pin-marker {
  position: absolute;
  z-index: 2147483642;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--arc-gradient);
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 0 4px 14px rgba(168, 85, 247, 0.5), 0 0 0 2px rgba(255, 255, 255, 0.9);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
  transform: translate(-50%, -50%);
  user-select: none;
}

.arc-pin-marker:hover {
  transform: translate(-50%, -50%) scale(1.15);
  box-shadow: 0 6px 18px rgba(168, 85, 247, 0.75), 0 0 0 2px #FFFFFF;
}

.arc-pin-marker.active {
  transform: translate(-50%, -50%) scale(1.2);
  box-shadow: 0 8px 22px rgba(255, 110, 167, 0.8), 0 0 0 2.5px #FFFFFF;
}

/* Figma-style Comment Popover */
.arc-popover {
  position: absolute;
  z-index: 2147483645;
  width: 320px;
  background: var(--arc-glass-bg);
  backdrop-filter: blur(32px) saturate(200%);
  -webkit-backdrop-filter: blur(32px) saturate(200%);
  border: 1px solid var(--arc-border);
  border-radius: var(--arc-radius-card);
  padding: 14px;
  box-shadow: var(--arc-shadow-hover);
  pointer-events: auto;
  animation: arc-pop-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes arc-pop-in {
  from { opacity: 0; transform: translateY(6px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.arc-popover-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.arc-component-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  border-radius: var(--arc-radius-pill);
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.28);
  color: var(--arc-cyan);
  font-size: 11px;
  font-weight: 600;
  max-width: 230px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Category Chips (Clean Text, No Emojis) */
.arc-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
}

.arc-chip {
  padding: 3px 9px;
  border-radius: var(--arc-radius-pill);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--arc-border);
  font-size: 11px;
  font-weight: 500;
  color: #A1A1AA;
  cursor: pointer;
  transition: all 0.15s ease;
}

.arc-chip:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
}

.arc-chip.selected {
  background: var(--arc-gradient);
  border-color: rgba(255, 255, 255, 0.3);
  color: #FFFFFF;
  font-weight: 600;
}

/* Comment Input */
.arc-textarea {
  width: 100%;
  height: 76px;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.32);
  border: 1px solid var(--arc-border);
  border-radius: 10px;
  color: #F4F4F5;
  font-size: 12px;
  line-height: 1.5;
  resize: none;
  outline: none;
  transition: border-color 0.15s ease;
  font-family: inherit;
}

.arc-textarea:focus {
  border-color: var(--arc-purple);
  box-shadow: 0 0 0 1px var(--arc-purple);
}

.arc-textarea::placeholder {
  color: #71717A;
}

/* Popover Footer */
.arc-popover-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

.arc-btn-icon {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--arc-border);
  color: #A1A1AA;
  cursor: pointer;
  transition: all 0.15s ease;
}

.arc-btn-icon:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #FFFFFF;
}

.arc-btn-icon.danger:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
  color: #EF4444;
}

/* Slide-up Tray (Docked at Bottom-Right above Launcher) */
.arc-tray {
  position: fixed;
  bottom: 76px;
  right: 24px;
  width: 380px;
  max-width: 90vw;
  max-height: 360px;
  background: var(--arc-glass-bg);
  backdrop-filter: blur(32px) saturate(200%);
  -webkit-backdrop-filter: blur(32px) saturate(200%);
  border: 1px solid var(--arc-border);
  border-radius: var(--arc-radius-card);
  padding: 14px;
  box-shadow: var(--arc-shadow-hover);
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: auto;
  animation: arc-pop-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 2147483646;
}

.arc-tray-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--arc-border);
}

.arc-tray-title {
  font-size: 12px;
  font-weight: 600;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  gap: 6px;
}

.arc-tray-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  max-height: 250px;
  padding-right: 2px;
}

.arc-tray-list::-webkit-scrollbar {
  width: 4px;
}

.arc-tray-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.arc-tray-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--arc-border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.arc-tray-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--arc-border-highlight);
}

.arc-tray-item-left {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.arc-tray-pin-num {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--arc-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #FFFFFF;
  flex-shrink: 0;
}

.arc-tray-item-content {
  flex: 1;
  min-width: 0;
}

.arc-tray-item-meta {
  font-size: 11px;
  color: var(--arc-cyan);
  font-weight: 600;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.arc-tray-item-text {
  font-size: 11px;
  color: #E4E4E7;
  line-height: 1.4;
  word-break: break-word;
}
`;
