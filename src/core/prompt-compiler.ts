import { AgentPin, PinCategory } from '../types';

const CATEGORY_LABELS: Record<PinCategory, string> = {
  style: 'Style',
  copy: 'Copy',
  layout: 'Layout',
  motion: 'Motion',
  bug: 'Bug',
  general: 'Note',
};

function getDeviceType(width: number): string {
  if (width < 640) return 'Mobile (< 640px)';
  if (width < 1024) return 'Tablet (640-1024px)';
  return 'Desktop (>= 1024px)';
}

/**
 * Compiles a list of visual pins into a structured prompt for AI coding agents
 */
export function compileAgentPrompt(pins: AgentPin[]): string {
  if (pins.length === 0) {
    return 'No visual pins recorded.';
  }

  const firstPin = pins[0];
  const viewport = firstPin.metadata.viewport;
  const route = firstPin.metadata.route;
  const deviceType = getDeviceType(viewport.width);

  const header = [
    `### AgentLens: Visual UI Feedback (${pins.length} ${pins.length === 1 ? 'item' : 'items'})`,
    `**Context:** Route: \`${route}\` | Viewport: \`${viewport.width} × ${viewport.height}px\` (${deviceType})`,
    `**Timestamp:** ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    '',
    'Please implement the following visual and code adjustments:',
    '',
    '---',
  ].join('\n');

  const pinSections = pins.map((pin) => {
    const meta = pin.metadata;
    const catLabel = CATEGORY_LABELS[pin.category] || 'Note';
    const componentHeader = meta.componentName
      ? `<${meta.componentName}> (${meta.tagName})`
      : `<${meta.tagName}>`;

    const lines: string[] = [
      `#### Pin #${pin.number}: ${componentHeader}`,
      `- **Category:** [${catLabel}]`,
      `- **Instruction:** "${pin.instruction.trim()}"`,
    ];

    if (meta.sourceFile) {
      lines.push(`- **Source Component:** \`${meta.sourceFile}\``);
    }

    lines.push(`- **CSS Selector:** \`${meta.selector}\``);

    if (meta.textSnippet) {
      lines.push(`- **Current Text Snippet:** "${meta.textSnippet}"`);
    }

    if (meta.classes) {
      lines.push(`- **Current Classes:** \`${meta.classes}\``);
    }

    // Format computed metrics cleanly
    const cs = meta.computedStyles;
    const metrics: string[] = [];
    metrics.push(`box: ${cs.width || 'auto'} × ${cs.height || 'auto'}`);
    if (cs.display) metrics.push(`display: ${cs.display}`);
    if (cs.gap) metrics.push(`gap: ${cs.gap}`);
    if (cs.padding) metrics.push(`padding: ${cs.padding}`);
    if (cs.margin) metrics.push(`margin: ${cs.margin}`);
    if (cs.backgroundColor) metrics.push(`bg: ${cs.backgroundColor}`);
    if (cs.color) metrics.push(`color: ${cs.color}`);
    if (cs.fontSize) metrics.push(`font-size: ${cs.fontSize}`);
    if (cs.borderRadius) metrics.push(`radius: ${cs.borderRadius}`);

    if (metrics.length > 0) {
      lines.push(`- **Computed Styles:** ${metrics.join(' | ')}`);
    }

    return lines.join('\n');
  });

  const footer = [
    '---',
    '**Implementation Guidance:**',
    '1. Locate each component file indicated above.',
    '2. Apply the requested visual styling, copy, or layout adjustments.',
    '3. Ensure responsive behavior is preserved across breakpoints.',
  ].join('\n');

  return [header, ...pinSections, footer].join('\n\n');
}
