import * as React from 'react';

/** Text / number field. Radius 20, hairline border, ink border on focus, red border + caption on error. */
export interface InputProps {
  /** Field label. Accepts a node so a badge can sit inline after the text. */
  label?: React.ReactNode;
  value?: string | number;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** trailing unit, e.g. "g" or "kkal" */
  unit?: string;
  /** blocking validation message — red border + red caption under the field */
  error?: string;
  /** non-blocking advisory under the field: grey caption, border unchanged. Suppressed while `error` is set. */
  warning?: string;
  /** node under the caption — e.g. the two exit actions on a blocked O6 target weight */
  footer?: React.ReactNode;
  disabled?: boolean;
  type?: string;
  inputMode?: string;
  /** tabular numerals + numeric keypad */
  numeric?: boolean;
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
