/**
 * Lucide glyph wrapper (intentional addition — no icon set came with the brief).
 * Requires the Lucide UMD script on the page.
 */
export interface IconProps {
  /** Lucide icon name, e.g. "camera", "image", "pencil", "plus" */
  name: string;
  /** 20 in lists and tabs, 24 for screen-level affordances */
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
