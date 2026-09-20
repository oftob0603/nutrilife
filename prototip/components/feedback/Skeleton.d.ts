/** Loading placeholder in --chegara with a 1.5s pulse. Takes the radius of whatever it stands in for. */
export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: string;
  /** render as a circle of diameter = height (for the daily ring) */
  circle?: boolean;
  style?: React.CSSProperties;
}
export declare function Skeleton(props: SkeletonProps): JSX.Element;
