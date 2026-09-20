import * as React from 'react';

export interface PressableProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. Defaults to button. */
  as?: keyof JSX.IntrinsicElements;
  /** Press scale — defaults to --press-scale (0.98). Use --press-scale-button for
   *  buttons (0.97) and --press-scale-fab for the centre + (0.92). */
  scale?: string;
  /** Spring settle on release — reserved for the centre + button. */
  spring?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Wrapper that gives any element the house press feel: a scale down on pointer-down,
 * back to 1 on release, 150ms. Sets data-pressed while held so siblings can react
 * (e.g. a row's chevron nudging right). Motion tokens flatten under
 * prefers-reduced-motion, so no media query is needed at the call site.
 */
export declare function Pressable(props: PressableProps): React.ReactElement;
