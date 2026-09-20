/**
 * Empty state. Always three parts: what is missing, why, and one action.
 * A bare "Ma'lumot yo'q" is not acceptable.
 */
export interface EmptyStateProps {
  /** Lucide icon name */
  icon?: string;
  title?: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  style?: React.CSSProperties;
}
export declare function EmptyState(props: EmptyStateProps): JSX.Element;
