import React, { useEffect, useState } from 'react';
import { extractElementMetadata } from '../core/extractor';
import { ElementMetadata } from '../types';

interface ArcInspectorProps {
  isActive: boolean;
  onSelectElement: (element: HTMLElement) => void;
  shadowHost: HTMLElement | null;
}

export const ArcInspector: React.FC<ArcInspectorProps> = ({
  isActive,
  onSelectElement,
  shadowHost,
}) => {
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);
  const [meta, setMeta] = useState<ElementMetadata | null>(null);

  useEffect(() => {
    if (!isActive) {
      setHoveredRect(null);
      setMeta(null);
      return;
    }

    const handlePointerMove = (e: MouseEvent | PointerEvent) => {
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (!target || target === document.body || target === document.documentElement) {
        setHoveredRect(null);
        setMeta(null);
        return;
      }

      // Ignore elements inside the shadow host
      if (shadowHost && (shadowHost.contains(target) || shadowHost === target)) {
        return;
      }

      const rect = target.getBoundingClientRect();
      setHoveredRect(rect);
      setMeta(extractElementMetadata(target));
    };

    // Intercept pointerdown & mousedown in capture phase:
    // This PREVENTS Radix/HeadlessUI DismissableLayer from seeing an outside-click
    // when clicking an element to pin inside a popover, dropdown, or modal!
    const handlePointerDown = (e: PointerEvent | MouseEvent) => {
      if (shadowHost && (shadowHost.contains(e.target as Node) || shadowHost === e.target)) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };

    const handleClick = (e: MouseEvent) => {
      if (shadowHost && (shadowHost.contains(e.target as Node) || shadowHost === e.target)) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (!target || target === document.body || target === document.documentElement) return;

      onSelectElement(target);
      setHoveredRect(null);
      setMeta(null);
    };

    // Capture phase listeners so we intercept before any framework library
    window.addEventListener('pointermove', handlePointerMove, { passive: true, capture: true });
    window.addEventListener('pointerdown', handlePointerDown, { capture: true });
    window.addEventListener('mousedown', handlePointerDown, { capture: true });
    window.addEventListener('click', handleClick, { capture: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove, true);
      window.removeEventListener('pointerdown', handlePointerDown, true);
      window.removeEventListener('mousedown', handlePointerDown, true);
      window.removeEventListener('click', handleClick, true);
    };
  }, [isActive, shadowHost, onSelectElement]);

  if (!isActive || !hoveredRect || !meta) return null;

  const label = meta.componentName ? `<${meta.componentName}>` : meta.tagName;
  const dimensions = `${Math.round(hoveredRect.width)}×${Math.round(hoveredRect.height)}`;

  // Ensure inspector label doesn't render above screen top
  const labelTop = hoveredRect.top > 32 ? -26 : hoveredRect.height + 6;

  return (
    <div
      className="arc-inspect-box"
      style={{
        top: `${hoveredRect.top}px`,
        left: `${hoveredRect.left}px`,
        width: `${hoveredRect.width}px`,
        height: `${hoveredRect.height}px`,
      }}
    >
      <div className="arc-inspect-label" style={{ top: `${labelTop}px` }}>
        <span>{label}</span>
        <span className="size">{dimensions}</span>
      </div>
    </div>
  );
};
