/** Card surface: --karta background, radius 20, padding 16, 1px hairline. No shadow. */
export interface CardProps {
  /** false removes the 16px padding (for full-bleed images or list rows) */
  padded?: boolean;
  as?: keyof JSX.IntrinsicElements;
  /** passing onClick makes the card pressable (scale 0.98) */
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
