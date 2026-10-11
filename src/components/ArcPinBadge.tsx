import React, { useEffect, useState, useCallback } from 'react';
import { AgentPin } from '../types';

interface ArcPinBadgeProps {
  pin: AgentPin;
  isActive: boolean;
  onClick: () => void;
}

export const ArcPinBadge: React.FC<ArcPinBadgeProps> = ({ pin, isActive, onClick }) => {
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  const updatePosition = useCallback(() => {
    if (!pin.targetElement || !pin.targetElement.isConnected) {
      setCoords(null);
      return;
    }
    const rect = pin.targetElement.getBoundingClientRect();
    // Anchor pin badge to top-left of the element with slight offset
    const x = rect.left + Math.min(16, rect.width / 2);
    const y = rect.top + Math.min(16, rect.height / 2);
    setCoords({ x, y });
  }, [pin.targetElement]);

  useEffect(() => {
    updatePosition();

    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();

    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    window.addEventListener('resize', handleResize, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (pin.targetElement && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updatePosition());
      resizeObserver.observe(pin.targetElement);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
    };
  }, [updatePosition, pin.targetElement]);

  if (!coords) return null;

  return (
    <div
      className={`arc-pin-marker ${isActive ? 'active' : ''}`}
      style={{
        left: `${coords.x}px`,
        top: `${coords.y}px`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={`Pin #${pin.number}: ${pin.metadata.componentName || pin.metadata.tagName}`}
    >
      {pin.number}
    </div>
  );
};
