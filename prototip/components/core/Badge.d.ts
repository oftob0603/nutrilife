/** Pill label. `ai` is the "AI taxmini" badge that must sit next to every AI-produced
 *  number; `pro` is the PRO-tier gradient, matching `Button variant="pro"`. */
export interface BadgeProps {
  /** ai = lime AI mark; pro = blue→purple→pink gradient for PRO labels (user app only —
   *  the admin panel's PRO role badges stay `ai`); neutral = hairline; error = red outline */
  tone?: 'ai' | 'pro' | 'neutral' | 'error';
  children?: React.ReactNode;
  /** Makes the pill a button — every PRO badge shown to a non-PRO user gets this,
   *  wired to the one tariffs handler. Renders a <span> when omitted. */
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
