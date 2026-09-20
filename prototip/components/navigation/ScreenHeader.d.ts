/** Screen title row with the mandatory back affordance (every screen has one except E8). */
export interface ScreenHeaderProps {
  title?: string;
  /** small line above the title, e.g. the date */
  subtitle?: string;
  onBack?: () => void;
  action?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function ScreenHeader(props: ScreenHeaderProps): JSX.Element;
