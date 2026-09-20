/** Week strip on Home (E1): Du–Ya with today selected. */
export interface DayPickerProps {
  days?: Array<{ label: string; date: number | string; value: number }>;
  value?: number;
  onChange?: (value: number) => void;
  style?: React.CSSProperties;
}
export declare function DayPicker(props: DayPickerProps): JSX.Element;
