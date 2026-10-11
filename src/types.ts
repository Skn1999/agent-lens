export type PinCategory = 'style' | 'copy' | 'layout' | 'motion' | 'bug' | 'general';

export interface ComputedStyleMetrics {
  display?: string;
  flexDirection?: string;
  gridTemplateColumns?: string;
  gap?: string;
  padding?: string;
  margin?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  borderRadius?: string;
  border?: string;
}

export interface ElementMetadata {
  componentName?: string | null;
  sourceFile?: string | null;
  selector: string;
  tagName: string;
  classes: string;
  textSnippet?: string | null;
  rect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  computedStyles: ComputedStyleMetrics;
  viewport: {
    width: number;
    height: number;
  };
  route: string;
}

export interface AgentPin {
  id: string;
  number: number;
  targetElement: HTMLElement;
  category: PinCategory;
  instruction: string;
  createdAt: number;
  metadata: ElementMetadata;
}

export interface AgentLensProps {
  /** Shortcut to toggle inspect mode (default: 'meta+shift+f' or 'c') */
  shortcut?: string;
  /** Position of the floating dock */
  position?: 'bottom-center' | 'bottom-right' | 'top-right';
  /** Default category for new pins */
  defaultCategory?: PinCategory;
  /** Callback fired when a prompt is generated */
  onPromptCopied?: (promptText: string, pinCount: number) => void;
}
