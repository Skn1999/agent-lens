export { AgentLens } from './AgentLens';
export { compileAgentPrompt } from './core/prompt-compiler';
export { extractElementMetadata } from './core/extractor';
export { isEditableElement, isUserTyping } from './core/hotkey-guard';
export type {
  AgentLensProps,
  AgentPin,
  ElementMetadata,
  PinCategory,
  ComputedStyleMetrics,
} from './types';
