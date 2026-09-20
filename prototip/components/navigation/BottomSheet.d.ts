/** Bottom sheet with grab handle, radius 28 top corners. Positions itself against the nearest positioned ancestor. */
export interface BottomSheetProps {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function BottomSheet(props: BottomSheetProps): JSX.Element;
