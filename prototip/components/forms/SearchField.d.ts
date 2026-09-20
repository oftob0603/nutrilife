/** Food-database search field (E4). Same shell as Input plus a leading magnifier and a clear button. */
export interface SearchFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  style?: React.CSSProperties;
}
export declare function SearchField(props: SearchFieldProps): JSX.Element;
