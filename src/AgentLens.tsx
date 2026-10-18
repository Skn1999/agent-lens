import React, { useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AgentLensProps, AgentPin, PinCategory } from './types';
import { extractElementMetadata } from './core/extractor';
import { compileAgentPrompt } from './core/prompt-compiler';
import { ARC_THEME_CSS } from './styles/arc-theme';
import { ArcDock } from './components/ArcDock';
import { ArcInspector } from './components/ArcInspector';
import { ArcPinBadge } from './components/ArcPinBadge';
import { ArcPopover } from './components/ArcPopover';
import { ArcTray } from './components/ArcTray';

export const AgentLens: React.FC<AgentLensProps> = ({
  defaultCategory = 'style',
  onPromptCopied,
}) => {
  const [shadowHost, setShadowHost] = useState<HTMLElement | null>(null);
  const [shadowContainer, setShadowContainer] = useState<HTMLElement | null>(null);

  const [pins, setPins] = useState<AgentPin[]>([]);
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [isInspectActive, setIsInspectActive] = useState(false);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [freezeCountdown, setFreezeCountdown] = useState<number | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Setup Shadow DOM on mount for true style isolation
  useEffect(() => {
    const existing = document.getElementById('agent-lens-host');
    if (existing) {
      existing.remove();
    }

    const host = document.createElement('div');
    host.id = 'agent-lens-host';
    document.body.appendChild(host);

    const shadowRoot = host.attachShadow({ mode: 'open' });

    // Inject styles into shadow DOM
    const styleEl = document.createElement('style');
    styleEl.textContent = ARC_THEME_CSS;
    shadowRoot.appendChild(styleEl);

    // Create container inside shadow root for React portal
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.zIndex = '2147483647';
    shadowRoot.appendChild(container);

    setShadowHost(host);
    setShadowContainer(container);

    return () => {
      host.remove();
    };
  }, []);

  // Global Event Shield:
  // When interacting with AgentLens (launcher, dock, tray, popover), intercept pointerdown & mousedown
  // in the window capture phase so that Radix/Floating UI/Headless UI outside-click listeners on 'document'
  // NEVER receive the event and therefore DO NOT close open popovers or modals!
  useEffect(() => {
    if (!shadowHost) return;

    const handlePointerShield = (e: Event) => {
      const target = e.target as Node | null;
      if (shadowHost && (shadowHost.contains(target) || shadowHost === target)) {
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };

    window.addEventListener('pointerdown', handlePointerShield, { capture: true });
    window.addEventListener('mousedown', handlePointerShield, { capture: true });

    return () => {
      window.removeEventListener('pointerdown', handlePointerShield, true);
      window.removeEventListener('mousedown', handlePointerShield, true);
    };
  }, [shadowHost]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        (activeEl as HTMLElement)?.isContentEditable;

      const isOptionOrAlt = e.altKey;

      // Option+C (or Alt+C): Toggles inspect mode anywhere, even inside inputs or modal dialogs!
      if (isOptionOrAlt && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setIsInspectActive((prev) => !prev);
        return;
      }

      // Option+F (or Alt+F): Trigger Freeze countdown anywhere!
      if (isOptionOrAlt && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        handleTriggerFreeze();
        return;
      }

      // Plain 'c' hotkey (when not typing in an input)
      if (!isInput && e.key.toLowerCase() === 'c' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setIsInspectActive((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
          setFreezeCountdown(null);
        }
        setIsInspectActive(false);
        setActivePinId(null);
        setIsTrayOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Trigger 3s freeze countdown for inspecting transient menus, hovercards, or popovers
  const handleTriggerFreeze = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    setFreezeCountdown(3);
    let current = 3;

    countdownIntervalRef.current = setInterval(() => {
      current -= 1;
      if (current > 0) {
        setFreezeCountdown(current);
      } else {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }
        setFreezeCountdown(null);
        setIsInspectActive(true); // Freeze & activate inspector!
      }
    }, 1000);
  }, []);

  // Handle selecting an element to pin
  const handleSelectElement = useCallback(
    (element: HTMLElement) => {
      const metadata = extractElementMetadata(element);
      const newPinNumber = pins.length + 1;
      const newPinId = `pin-${Date.now()}`;

      const newPin: AgentPin = {
        id: newPinId,
        number: newPinNumber,
        targetElement: element,
        category: defaultCategory,
        instruction: '',
        createdAt: Date.now(),
        metadata,
      };

      setPins((prev) => [...prev, newPin]);
      setActivePinId(newPinId);
      setIsInspectActive(false);
    },
    [pins.length, defaultCategory]
  );

  // Save changes to active pin
  const handleSavePin = useCallback((instruction: string, category: PinCategory) => {
    setPins((prev) =>
      prev.map((p) => (p.id === activePinId ? { ...p, instruction, category } : p))
    );
    setActivePinId(null);
  }, [activePinId]);

  // Delete a pin and renumber remaining pins sequentially
  const handleDeletePin = useCallback((pinId: string) => {
    setPins((prev) => {
      const filtered = prev.filter((p) => p.id !== pinId);
      return filtered.map((pin, idx) => ({ ...pin, number: idx + 1 }));
    });
    setActivePinId((current) => (current === pinId ? null : current));
  }, []);

  // Clear all pins
  const handleClearAll = useCallback(() => {
    setPins([]);
    setActivePinId(null);
    setIsTrayOpen(false);
  }, []);

  // Compile and copy prompt to clipboard
  const handleCopyPrompt = useCallback(() => {
    if (pins.length === 0) return;
    const prompt = compileAgentPrompt(pins);
    navigator.clipboard.writeText(prompt);
    onPromptCopied?.(prompt, pins.length);
  }, [pins, onPromptCopied]);

  if (!shadowContainer) return null;

  const activePin = pins.find((p) => p.id === activePinId);

  return createPortal(
    <>
      {/* Hover inspector box with pointerdown shield */}
      <ArcInspector
        isActive={isInspectActive}
        onSelectElement={handleSelectElement}
        shadowHost={shadowHost}
      />

      {/* Floating pin markers */}
      {pins.map((pin) => (
        <ArcPinBadge
          key={pin.id}
          pin={pin}
          isActive={pin.id === activePinId}
          onClick={() => {
            setActivePinId((curr) => (curr === pin.id ? null : pin.id));
          }}
        />
      ))}

      {/* Active comment popover */}
      {activePin && (
        <ArcPopover
          pin={activePin}
          onSave={handleSavePin}
          onDelete={() => handleDeletePin(activePin.id)}
          onClose={() => setActivePinId(null)}
        />
      )}

      {/* Slide-up pins review tray */}
      <ArcTray
        pins={pins}
        isOpen={isTrayOpen}
        onSelectPin={(pin) => setActivePinId(pin.id)}
        onDeletePin={handleDeletePin}
        onClearAll={handleClearAll}
        onClose={() => setIsTrayOpen(false)}
      />

      {/* Arc Floating Dock with Freeze Timer */}
      <ArcDock
        isInspectActive={isInspectActive}
        pinCount={pins.length}
        isTrayOpen={isTrayOpen}
        freezeCountdown={freezeCountdown}
        onToggleInspect={() => setIsInspectActive((prev) => !prev)}
        onToggleTray={() => setIsTrayOpen((prev) => !prev)}
        onTriggerFreeze={handleTriggerFreeze}
        onCopyPrompt={handleCopyPrompt}
      />
    </>,
    shadowContainer
  );
};
