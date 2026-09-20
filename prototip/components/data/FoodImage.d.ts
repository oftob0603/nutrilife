/**
 * Food photo holder. 4:3 by default, radius 12, and it reserves its box with
 * a --chegara fill before load so lists never jump.
 */
export interface FoodImageProps {
  src?: string;
  alt?: string;
  /** square px size for list thumbnails (e.g. 56) */
  size?: number;
  radius?: string;
  ratio?: string;
  style?: React.CSSProperties;
}
export declare function FoodImage(props: FoodImageProps): JSX.Element;
