# AgentLens

> Figma-style visual review canvas designed specifically for AI coding agents (Antigravity, Claude, Cursor, Copilot).

Turn your live browser preview into a feedback canvas. Click any element, type your instructions, and compile developer-grade execution prompts with component paths, DOM selectors, and computed styles onto your clipboard with one click.

Designed with **Arc Browser UI aesthetics** (obsidian frosted glass, luminous neon-pastel gradients, tactile pills, pure SVG iconography) and **100% Shadow DOM style isolation**.

---

## Features

- **Figma-style Element Pinning**: Click any button, card, modal, or container to anchor a comment pin directly to the DOM element.
- **Modal & Popover Shielding**: Intercepts `pointerdown` and `mousedown` in the window capture phase so clicking the launcher, dock, or elements inside a modal/popover **never triggers an outside-click dismissal**.
- **3s Freeze Timer**: Inspect transient hover states, tooltips, or open dropdowns before pinning.
- **100% Isolated via Shadow DOM**: Host application CSS (Tailwind, resets, typography) will never leak into AgentLens, nor will AgentLens leak into your app.
- **React Fiber & Dev Awareness**: Automatically extracts the nearest React Component name (e.g. `<HeroHeader>`), source file (`src/components/Hero.tsx:42`), and unique CSS selectors.
- **Arc UI Components & Interactions**: Built with Arc browser frosted glass, tactile pill controls, and spring-like micro-interactions.
- **High-Signal Prompt Compiler**: 1-click **Copy Prompt** formats a structured, contextual markdown prompt ready to paste into your AI agent chat.
- **Zero-Footprint Production Mode**: Tree-shakes out cleanly when wrapped with `import.meta.env.DEV`.

---

## Quick Start

```tsx
import { AgentLens } from './labs/agent-lens/src';

export default function App() {
  return (
    <>
      <YourAppRoutes />

      {import.meta.env.DEV && <AgentLens />}
    </>
  );
}
```

---

## Shortcuts

- **`Option + C`** / **`Alt + C`**: Instant Inspect mode toggle anywhere (even while a modal has focus or cursor is hovering).
- **`Option + F`** / **`Alt + F`**: 3s Freeze countdown (gives you 3 seconds to open your dropdown or tooltip).
- **`C`**: Toggle Inspect mode (when not typing in an input).
- **`Cmd + Enter`** / **`Ctrl + Enter`**: Save current pin comment.
- **`Esc`**: Close active popover, tray, or cancel inspect mode.

---

## What the Agent Receives on "Copy Prompt"

```markdown
### AgentLens: Visual UI Feedback (2 items)
**Context:** Route: `/` | Viewport: `1440 × 900px` (Desktop)

#### Pin #1: `<HeroSection>` (button)
- **Category:** [Style]
- **Instruction:** "Increase height to 44px, use rounded-full, change background to zinc-900, text to white"
- **Source Component:** `src/components/Hero.tsx:42`
- **CSS Selector:** `header > nav > button.cta-primary`
- **Current Classes:** `bg-blue-600 text-white px-4 py-2 rounded-md`
- **Computed Styles:** box: 138px × 36px | padding: 8px 16px | radius: 6px

#### Pin #2: `<ProjectGrid>` (div)
- **Category:** [Layout]
- **Instruction:** "Reduce grid gap on mobile from gap-8 to gap-4"
- **Source Component:** `src/components/ProjectGrid.tsx:18`
- **CSS Selector:** `section#projects > div.grid`
- **Current Classes:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`
- **Computed Styles:** box: 1200px × 640px | gap: 32px
```

---

## License
MIT
