import * as React from 'react';

export interface TextareaProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
  /** Grey helper under the field, suppressed while `error` is set. */
  hint?: string;
  /** Renders a red asterisk after the label. */
  required?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}

/**
 * Multi-line field for admin content: mandatory reason fields, recipe ingredients and
 * steps in three languages. Same radius and border behaviour as Input.
 */
export declare function Textarea(props: TextareaProps): React.ReactElement;
