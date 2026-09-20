import * as React from 'react';

export interface OptionRowProps {
  /** Primary label, sentence case. */
  label: string;
  /** Optional second line explaining the option (e.g. "Haftada 3-5 kun mashq"). */
  caption?: string;
  /** Replaces the default check glyph on the right. */
  trailing?: React.ReactNode;
  selected?: boolean;
  /** Semantics only: checkbox role for multi-select questions (O8). */
  multi?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * Full-width selectable card used for every onboarding choice question (goal, gender,
 * activity, food preferences, motivation). Selected state is an ink fill with white text.
 */
export declare function OptionRow(props: OptionRowProps): React.ReactElement;
