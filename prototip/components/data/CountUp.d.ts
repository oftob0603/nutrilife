import * as React from 'react';

export interface CountUpProps {
  /** Target value. Changing it animates from the previous value. */
  value?: number;
  /** Override the --count-duration token (700ms). */
  duration?: number;
  /** Starting value on mount — pass 0 for the AI calorie reveal. Later `value` changes
   *  always tween from whatever is displayed, regardless of this. */
  from?: number;
  /** Fixed decimals when no `format` is given. */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Full control over the rendered string, e.g. thousands separators or a comma decimal. */
  format?: (current: number) => string;
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}

/**
 * A number that animates from its previous value to the new one — the AI calorie result
 * counting up, and the weight figure after a new measurement. Always tabular-nums, so
 * the width does not jitter. Honours prefers-reduced-motion by jumping straight to the value.
 */
export declare function CountUp(props: CountUpProps): React.ReactElement;
