/** One macro line (oqsil / yog' / uglevod) showing current / goal in grams. Fill is ink, not lime. */
export interface MacroBarProps {
  label?: string;
  value?: number;
  goal?: number;
  unit?: string;
  style?: React.CSSProperties;
}
export declare function MacroBar(props: MacroBarProps): JSX.Element;
