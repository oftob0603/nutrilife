import * as React from 'react';

export interface NoteProps {
  /** 'info' for explanations and disclaimers; 'warn' for the O6 safety notice. */
  tone?: 'info' | 'warn';
  /** Card-title line; required when collapsible. */
  title?: string;
  children?: React.ReactNode;
  /** Renders the title as a disclosure toggle — used for O12 "Nega shunday?". */
  collapsible?: boolean;
  defaultOpen?: boolean;
  style?: React.CSSProperties;
}

/**
 * Quiet explanatory card: the O6 low-goal safety notice, the O12 "why this number"
 * disclosure and the "this is not medical advice" line. Never a dialog, never a toast.
 */
export declare function Note(props: NoteProps): React.ReactElement;
