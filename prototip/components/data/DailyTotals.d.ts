/** Journal header (E9): the day's kcal total plus the three macro sums. */
export interface DailyTotalsProps {
  kcal?: number;
  goal?: number;
  macros?: Array<{ label: string; value: number }>;
  style?: React.CSSProperties;
}
export declare function DailyTotals(props: DailyTotalsProps): JSX.Element;
