/**
 * The daily calorie ring — the centre of the whole product (E1, E8).
 * 14px stroke, round caps, starts at 12 o'clock and fills clockwise.
 * Turns --xato when over goal and adds one caption line; never a warning dialog.
 *
 */
export interface DailyRingProps {
  value?: number;
  goal?: number;
  /** outer diameter in px */
  size?: number;
  stroke?: number;
  unit?: string;
  /** overrides the "2,190 dan" line under the big number */
  goalLabel?: string;
  overLabel?: string;
  /** 600ms fill; automatically skipped under prefers-reduced-motion */
  animate?: boolean;
  style?: React.CSSProperties;
}
export declare function DailyRing(props: DailyRingProps): JSX.Element;
