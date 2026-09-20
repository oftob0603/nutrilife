/**
 * NutriLife button. One primary button per screen (DESIGN.md §6).
 *
 */
export interface ButtonProps {
  /** primary = lime fill; pro = blue→purple→pink gradient, PRO-tier CTAs only; accent = lime fill (confirm actions only); secondary = hairline; tertiary = text only; danger = red text */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'pro' | 'danger';
  /** md = 52px (default), sm = 44px — never below 44 */
  size?: 'md' | 'sm';
  full?: boolean;
  disabled?: boolean;
  /** shows an in-button spinner and blocks re-taps while saving */
  loading?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
