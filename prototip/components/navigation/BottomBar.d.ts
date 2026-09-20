/**
 * Floating bottom bar: four sections with a larger ink "+" in the middle.
 * Hidden inside the add-food flow and while a bottom sheet is open.
 * Sections that are not built yet are omitted entirely — never shown disabled.
 *
 */
export interface BottomBarProps {
  items?: Array<{ value: string; label: string; icon: string }>;
  value?: string;
  onChange?: (value: string) => void;
  /** omit to hide the centre "+" */
  onAdd?: () => void;
  addLabel?: string;
  style?: React.CSSProperties;
}
export declare function BottomBar(props: BottomBarProps): JSX.Element;
