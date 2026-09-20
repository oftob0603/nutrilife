/** Rotating indicator. Allowed only inside a button and on the camera / AI-analysis screens. */
export interface SpinnerProps {
  size?: number;
  thickness?: number;
  color?: string;
  style?: React.CSSProperties;
}
export declare function Spinner(props: SpinnerProps): JSX.Element;
