/**
 * Utility functions for keyboard shortcut guarding.
 * Ensures typing in notes, inputs, textareas, and contenteditable elements
 * is never intercepted by AgentLens hotkeys.
 */

/**
 * Detects whether a DOM node is an interactive text input, textarea,
 * contenteditable element, or custom textbox widget where keystrokes represent text typing.
 */
export function isEditableElement(target: unknown): boolean {
  if (!target || typeof target !== 'object') {
    return false;
  }

  const el = target as {
    tagName?: string;
    type?: string;
    isContentEditable?: boolean;
    getAttribute?: (name: string) => string | null;
    closest?: (selector: string) => unknown;
  };

  const tagName = typeof el.tagName === 'string' ? el.tagName.toUpperCase() : '';

  if (tagName === 'TEXTAREA' || tagName === 'SELECT') {
    return true;
  }

  if (tagName === 'INPUT') {
    const type = (el.type || 'text').toLowerCase();
    // Non-text input types where keystrokes do not enter text
    const nonTextTypes = new Set([
      'button',
      'checkbox',
      'color',
      'file',
      'hidden',
      'image',
      'radio',
      'range',
      'reset',
      'submit',
    ]);
    return !nonTextTypes.has(type);
  }

  if (el.isContentEditable) {
    return true;
  }

  if (typeof el.getAttribute === 'function') {
    const contentEditable = el.getAttribute('contenteditable');
    if (contentEditable !== null && contentEditable !== 'false') {
      return true;
    }
    const role = el.getAttribute('role')?.toLowerCase();
    if (role === 'textbox' || role === 'searchbox') {
      return true;
    }
  }

  if (typeof el.closest === 'function') {
    if (
      el.closest(
        'textarea, input:not([type="button"]):not([type="checkbox"]):not([type="color"]):not([type="file"]):not([type="hidden"]):not([type="image"]):not([type="radio"]):not([type="range"]):not([type="reset"]):not([type="submit"]), [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="searchbox"]'
      )
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Checks whether the user is currently typing in an input, textarea, contenteditable,
 * or note editor. Supports open Shadow DOM boundaries, event composedPath, and IME composition.
 */
export function isUserTyping(e: KeyboardEvent): boolean {
  if (e.isComposing) {
    return true;
  }

  // 1. Check all elements in composedPath (innermost target up through shadow roots to window)
  const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
  for (const item of path) {
    if (isEditableElement(item)) {
      return true;
    }
  }

  // 2. Check direct target
  if (isEditableElement(e.target)) {
    return true;
  }

  // 3. Check deep activeElement across open shadow roots
  let activeEl: Element | null = typeof document !== 'undefined' ? document.activeElement : null;
  while (activeEl && activeEl.shadowRoot && activeEl.shadowRoot.activeElement) {
    activeEl = activeEl.shadowRoot.activeElement;
  }
  if (isEditableElement(activeEl)) {
    return true;
  }

  return false;
}
