import * as React from 'react';

export interface SettingRowProps {
  title: string;
  /** Current value, right-aligned in --matn-2 — the F2 settings pattern. */
  value?: React.ReactNode;
  /** Red title for destructive rows (F2 -> "Hisobni o'chirish"). */
  danger?: boolean;
  /** Replaces the value with an inline saving indicator; other rows stay usable. */
  saving?: boolean;
  /** Shows "Saqlanmadi. Qayta urinish" under the row. */
  error?: boolean;
  onClick?: () => void;
  /** Overrides the trailing chevron — pass a Switch, a Badge, or null. */
  trailing?: React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
}

/**
 * One row in a settings list: label left, current value right. Used for every row of
 * F2 (Sozlamalar) and the link list on F1. Group them inside a Card with padded={false}
 * and hairline dividers — the row itself draws no border.
 */
export declare function SettingRow(props: SettingRowProps): React.ReactElement;
