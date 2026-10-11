import React, { useEffect, useRef, useState } from 'react';
import { AgentPin, PinCategory } from '../types';
import { CloseIcon, TrashIcon } from './icons';

interface ArcPopoverProps {
  pin: AgentPin;
  onSave: (instruction: string, category: PinCategory) => void;
  onDelete: () => void;
  onClose: () => void;
}

const CATEGORIES: { id: PinCategory; label: string }[] = [
  { id: 'style', label: 'Style' },
  { id: 'copy', label: 'Copy' },
  { id: 'layout', label: 'Layout' },
  { id: 'motion', label: 'Motion' },
  { id: 'bug', label: 'Bug' },
];

export const ArcPopover: React.FC<ArcPopoverProps> = ({ pin, onSave, onDelete, onClose }) => {
  const [instruction, setInstruction] = useState(pin.instruction);
  const [category, setCategory] = useState<PinCategory>(pin.category);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 40);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onSave(instruction, category);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  // Calculate position relative to targetElement
  const rect = pin.targetElement?.getBoundingClientRect();
  const top = rect ? Math.min(window.innerHeight - 260, Math.max(16, rect.top + 28)) : 100;
  const left = rect ? Math.min(window.innerWidth - 340, Math.max(16, rect.left + 16)) : 100;

  const componentLabel = pin.metadata.componentName
    ? `<${pin.metadata.componentName}>`
    : `<${pin.metadata.tagName}>`;

  return (
    <div
      className="arc-popover"
      style={{
        top: `${top}px`,
        left: `${left}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="arc-popover-header">
        <span className="arc-component-badge" title={pin.metadata.sourceFile || pin.metadata.selector}>
          <span>#{pin.number}</span>
          <span>•</span>
          <span>{componentLabel}</span>
        </span>
        <button className="arc-btn-icon" onClick={onClose} title="Close">
          <CloseIcon size={12} />
        </button>
      </div>

      <div className="arc-chips">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`arc-chip ${category === cat.id ? 'selected' : ''}`}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <textarea
        ref={textareaRef}
        className="arc-textarea"
        placeholder="Instructions for the agent (e.g. increase padding, rounded-full, change copy...)"
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <div className="arc-popover-footer">
        <button
          className="arc-btn-icon danger"
          onClick={onDelete}
          title="Delete pin"
        >
          <TrashIcon size={13} />
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="arc-btn arc-btn-gradient"
            onClick={() => onSave(instruction, category)}
          >
            Save Pin
          </button>
        </div>
      </div>
    </div>
  );
};
