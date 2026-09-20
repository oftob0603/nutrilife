import * as React from 'react';

export interface CheckboxProps {
  /** Checked state. */
  checked?: boolean;
  onChange?: (next: boolean) => void;
  /** Label content — always present; a bare box is never shown. */
  children?: React.ReactNode;
  /** Inline validation text under the row, in --xato. */
  error?: string;
  /** Unchecked box fill. Transparent on flat --fon screens; pass var(--karta) when the
   *  checkbox sits on a photo or glass panel, where the hairline alone disappears. */
  boxFill?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

/**
 * Ink-filled 24px checkbox with a full-width 44px tap row. Used for the O1 terms consent
 * gate, where the primary button stays disabled until it is checked.
 */
export declare function Checkbox(props: CheckboxProps): React.ReactElement;
