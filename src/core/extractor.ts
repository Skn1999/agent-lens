import { ComputedStyleMetrics, ElementMetadata } from '../types';

/**
 * Traverses React Fiber internals to extract component name & debug source
 */
function extractReactInfo(element: HTMLElement): { componentName: string | null; sourceFile: string | null } {
  try {
    // 1. Check data-component-id or similar tagger attributes first (e.g. lovable-tagger, data-component)
    const taggerAttr = element.getAttribute('data-component-id') || element.getAttribute('data-component');
    if (taggerAttr) {
      return {
        componentName: taggerAttr.split(':')[0] || taggerAttr,
        sourceFile: taggerAttr.includes(':') ? taggerAttr : null,
      };
    }

    // 2. Search for React Fiber key on element
    const fiberKey = Object.keys(element).find(
      (key) => key.startsWith('__reactFiber$') || key.startsWith('__reactInternalInstance$')
    );

    if (!fiberKey) {
      return { componentName: null, sourceFile: null };
    }

    let fiber = (element as unknown as Record<string, unknown>)[fiberKey] as Record<string, unknown> | null;
    let componentName: string | null = null;
    let sourceFile: string | null = null;

    // Walk up the fiber tree until we find a named composite component
    while (fiber) {
      const type = fiber.type;
      const debugSource = fiber._debugSource as { fileName?: string; lineNumber?: number } | undefined;

      if (debugSource?.fileName && !sourceFile) {
        // Format sourceFile to be relative or concise
        const fileName = debugSource.fileName;
        const line = debugSource.lineNumber ? `:${debugSource.lineNumber}` : '';
        const cleanPath = fileName.replace(/.*\/src\//, 'src/');
        sourceFile = `${cleanPath}${line}`;
      }

      if (typeof type === 'function') {
        const name = (type as { displayName?: string; name?: string }).displayName || (type as { name?: string }).name;
        if (name && name !== 'Anonymous' && !name.startsWith('_') && !componentName) {
          componentName = name;
        }
      } else if (typeof type === 'object' && type !== null) {
        const name = (type as { displayName?: string }).displayName;
        if (name && !componentName) {
          componentName = name;
        }
      }

      if (componentName && sourceFile) {
        break;
      }

      fiber = (fiber.return as Record<string, unknown> | null) || null;
    }

    return { componentName, sourceFile };
  } catch {
    return { componentName: null, sourceFile: null };
  }
}

/**
 * Builds a readable, unique CSS selector for the given element
 */
function getElementSelector(element: HTMLElement): string {
  if (element.id) {
    return `#${CSS.escape(element.id)}`;
  }

  const testId = element.getAttribute('data-testid');
  if (testId) {
    return `[data-testid="${CSS.escape(testId)}"]`;
  }

  const path: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body) {
    let selector = current.tagName.toLowerCase();

    if (current.id) {
      selector = `#${CSS.escape(current.id)}`;
      path.unshift(selector);
      break;
    }

    // Include primary class if present and not a utility soup
    if (current.className && typeof current.className === 'string') {
      const classes = current.className
        .trim()
        .split(/\s+/)
        .filter((c) => !c.includes(':') && !c.includes('/') && !c.startsWith('[') && c.length < 25);
      if (classes.length > 0 && classes[0]) {
        selector += `.${CSS.escape(classes[0])}`;
      }
    }

    // Add nth-of-type if ambiguous among siblings
    const parent = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter((el) => el.tagName === current!.tagName);
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-of-type(${index})`;
      }
    }

    path.unshift(selector);
    current = current.parentElement;

    if (path.length >= 4) break; // Keep selectors concise
  }

  return path.join(' > ');
}

/**
 * Extracts essential computed layout and typography styles
 */
function getComputedMetrics(element: HTMLElement): ComputedStyleMetrics {
  const cs = window.getComputedStyle(element);

  const metrics: ComputedStyleMetrics = {};

  if (cs.display !== 'inline' && cs.display !== 'block') metrics.display = cs.display;
  if (cs.display.includes('flex')) {
    metrics.flexDirection = cs.flexDirection;
    if (cs.gap && cs.gap !== 'normal') metrics.gap = cs.gap;
  }
  if (cs.display.includes('grid') && cs.gridTemplateColumns) {
    metrics.gridTemplateColumns = cs.gridTemplateColumns;
    if (cs.gap && cs.gap !== 'normal') metrics.gap = cs.gap;
  }

  if (cs.padding && cs.padding !== '0px') metrics.padding = cs.padding;
  if (cs.margin && cs.margin !== '0px') metrics.margin = cs.margin;

  const rect = element.getBoundingClientRect();
  metrics.width = `${Math.round(rect.width)}px`;
  metrics.height = `${Math.round(rect.height)}px`;

  if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') {
    metrics.backgroundColor = cs.backgroundColor;
  }
  if (cs.color) metrics.color = cs.color;
  if (cs.fontSize) metrics.fontSize = cs.fontSize;
  if (cs.fontWeight && cs.fontWeight !== '400') metrics.fontWeight = cs.fontWeight;
  if (cs.borderRadius && cs.borderRadius !== '0px') metrics.borderRadius = cs.borderRadius;
  if (cs.border && cs.border !== 'none' && !cs.border.startsWith('0px')) metrics.border = cs.border;

  return metrics;
}

/**
 * Extracts comprehensive metadata for an inspected element
 */
export function extractElementMetadata(element: HTMLElement): ElementMetadata {
  const rect = element.getBoundingClientRect();
  const { componentName, sourceFile } = extractReactInfo(element);
  const selector = getElementSelector(element);
  const computedStyles = getComputedMetrics(element);

  // Extract brief text snippet (if any)
  let textSnippet: string | null = null;
  const rawText = element.innerText || element.textContent || '';
  const cleanText = rawText.replace(/\s+/g, ' ').trim();
  if (cleanText) {
    textSnippet = cleanText.length > 50 ? `${cleanText.slice(0, 47)}...` : cleanText;
  }

  const classes = typeof element.className === 'string' ? element.className.trim() : '';

  return {
    componentName,
    sourceFile,
    selector,
    tagName: element.tagName.toLowerCase(),
    classes,
    textSnippet,
    rect: {
      top: Math.round(rect.top + window.scrollY),
      left: Math.round(rect.left + window.scrollX),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    },
    computedStyles,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    route: window.location.pathname + window.location.search + window.location.hash,
  };
}
