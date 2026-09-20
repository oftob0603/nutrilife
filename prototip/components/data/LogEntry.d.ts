/**
 * One journal row: thumbnail, dish name, portion · time, kcal, and the AI badge when the
 * numbers came from a scan. Used on Home (last 3) and in the journal (E9).
 *
 */
export interface LogEntryProps {
  name?: string;
  /** e.g. "250 g" */
  portion?: string;
  /** e.g. "13:20" */
  time?: string;
  kcal?: number | string;
  image?: string;
  /** shows the "AI taxmini" badge */
  ai?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function LogEntry(props: LogEntryProps): JSX.Element;
