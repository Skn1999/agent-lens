# AgentLens

A visual review and feedback overlay for React applications, designed to generate structured, context-rich execution prompts for AI coding agents.

---

## 1. What is it

**AgentLens** is a lightweight in-browser inspection overlay for React web applications. It allows developers and designers to click on any UI element in a running application, annotate it with visual pins and actionable instructions, and automatically compile all feedback into structured, developer-grade markdown prompts ready for AI coding agents (such as Antigravity, Claude, Cursor, Copilot, and others).

### Key Capabilities:
- **DOM Element Pinning:** Click buttons, containers, cards, or dialogs to anchor visual feedback pins directly to target elements.
- **Automatic React & DOM Metadata Extraction:** Automatically captures the component name (e.g. `<HeroSection>`), source file location (when React DevTools/Fiber information is available), unique CSS selectors, class names, and computed layout styles (dimensions, padding, margins, colors, border-radius).
- **Style Isolation via Shadow DOM:** Renders completely inside an isolated Shadow DOM container so host application styles (e.g., Tailwind CSS, CSS resets) never affect AgentLens, and AgentLens styles never bleed into your app.
- **Event Shielding:** Intercepts pointer events during the capture phase, preventing outside-click handlers on modals, popovers, and dropdowns from prematurely closing when placing pins.
- **3-Second Freeze Timer:** Temporarily freezes UI interactions to make it easy to inspect transient elements like hover cards, active dropdowns, and tooltips.
- **One-Click Agent Prompt Compiler:** Aggregates all placed pins into a formatted markdown prompt containing route, viewport, component references, and implementation guidance.

---

## 2. How to install it

### Package Manager Installation

Install `@naylabs/agent-lens` as a development dependency in your project:

```bash
# npm
npm install --save-dev @naylabs/agent-lens

# pnpm
pnpm add -D @naylabs/agent-lens

# yarn
yarn add -D @naylabs/agent-lens

# bun
bun add -d @naylabs/agent-lens
```

### Installing in Your System (Local Development / Linking)

If you are developing locally or want to use a local build across multiple projects on your machine:

#### Option A: Clone and Build Locally
```bash
git clone https://github.com/Skn1999/agent-lens.git
cd agent-lens
npm install
npm run build
```

#### Option B: Global Symlink (`npm link`)
1. In the `agent-lens` directory, create a global symlink:
   ```bash
   cd /path/to/agent-lens
   npm link
   ```
2. In your target project directory, link the package:
   ```bash
   cd /path/to/your-project
   npm link @naylabs/agent-lens
   ```

#### Option C: Install Directly via Local File Path
In your target project, install directly pointing to the local directory:
```bash
cd /path/to/your-project
npm install /path/to/agent-lens
```

---

## 3. How to use it

### Basic Setup

Mount `<AgentLens />` at the root of your React application (for example, in `App.tsx` or your root layout). It is recommended to enable it only during development:

```tsx
import React from 'react';
import { AgentLens } from '@naylabs/agent-lens';

export default function App() {
  return (
    <>
      <YourApplicationRoutes />

      {/* Render AgentLens during development */}
      {process.env.NODE_ENV === 'development' && <AgentLens />}

      {/* Or with Vite: */}
      {/* {import.meta.env.DEV && <AgentLens />} */}
    </>
  );
}
```

### Component Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `defaultCategory` | `'style' \| 'copy' \| 'layout' \| 'motion' \| 'bug' \| 'general'` | `'style'` | Initial category selected when creating a new pin. |
| `onPromptCopied` | `(promptText: string, pinCount: number) => void` | `undefined` | Optional callback triggered when the compiled prompt is copied to clipboard. |

### Feedback Workflow

1. **Activate Inspect:** Click the floating launcher pill or press `Option + C` (`Alt + C`).
2. **Select Element:** Click on any element on the page to place a numbered pin.
3. **Add Instructions:** Select a category (`Style`, `Copy`, `Layout`, `Motion`, `Bug`, `Note`), type your requested change, and press `Cmd + Enter` / `Ctrl + Enter` to save.
4. **Copy Prompt:** Click **Copy Prompt** in the dock or pin tray.
5. **Feed to AI Agent:** Paste the generated markdown directly into your AI coding assistant.

---

## 4. Shortcuts

| Shortcut | Description |
| :--- | :--- |
| **`Option + C`** / **`Alt + C`** | Toggle Inspect mode globally from anywhere (works even inside input fields and active modals). |
| **`C`** | Toggle Inspect mode (when not typing in an input or text area). |
| **`Option + F`** / **`Alt + F`** | Trigger the **3-Second Freeze Timer** (allows you to open hover states or dropdowns before inspecting). |
| **`Cmd + Enter`** / **`Ctrl + Enter`** | Save comment in the active pin popover. |
| **`Esc`** | Close the active popover, close the tray, cancel freeze timer, or exit inspect mode. |

---

## 5. Agent copy prompt format

When you click **Copy Prompt**, AgentLens compiles your visual pins into a structured markdown document. Below is an example of the output generated:

````markdown
### AgentLens: Visual UI Feedback (2 items)
**Context:** Route: `/dashboard` | Viewport: `1440 × 900px` (Desktop (>= 1024px))
**Timestamp:** 08:30 PM

Please implement the following visual and code adjustments:

---

#### Pin #1: <HeroHeader> (button)
- **Category:** [Style]
- **Instruction:** "Increase height to 44px, use rounded-full, change background to zinc-900, text to white"
- **Source Component:** `src/components/HeroHeader.tsx:42`
- **CSS Selector:** `header > nav > button.cta-primary`
- **Current Text Snippet:** "Get Started"
- **Current Classes:** `bg-blue-600 text-white px-4 py-2 rounded-md`
- **Computed Styles:** box: 138px × 36px | padding: 8px 16px | bg: rgb(37, 99, 235) | color: rgb(255, 255, 255) | radius: 6px

#### Pin #2: <ProjectGrid> (div)
- **Category:** [Layout]
- **Instruction:** "Reduce grid gap on mobile from gap-8 to gap-4"
- **Source Component:** `src/components/ProjectGrid.tsx:18`
- **CSS Selector:** `section#projects > div.grid`
- **Current Classes:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`
- **Computed Styles:** box: 1200px × 640px | display: grid | gap: 32px

---
**Implementation Guidance:**
1. Locate each component file indicated above.
2. Apply the requested visual styling, copy, or layout adjustments.
3. Ensure responsive behavior is preserved across breakpoints.
````

---

## 6. How to submit feature request

If you have suggestions, feature requests, or improvements, please email me at:

**[sknayyar.sk@gmail.com](mailto:sknayyar.sk@gmail.com)**

---

## 7. License

This project is licensed under the [MIT License](LICENSE).
