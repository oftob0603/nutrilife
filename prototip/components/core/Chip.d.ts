/** Selectable chip — portion sizes (150 g / 250 g / 350 g / Boshqa) and other short single-choice sets. */
export interface ChipProps {
  selected?: boolean;
  disabled?: boolean;
  /** PRO-gated chip — paints the tier gradient, independent of `selected`. */
  pro?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Chip(props: ChipProps): JSX.Element;
