/** Large tappable row with icon, title and one caption line — the three source buttons in E2. */
export interface ActionRowProps {
  icon?: string;
  title?: string;
  /** the single explanatory line, e.g. "Ovqatni rasmga oling" */
  caption?: string;
  disabled?: boolean;
  onClick?: () => void;
  trailing?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function ActionRow(props: ActionRowProps): JSX.Element;
