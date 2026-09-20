/**
 * Error block. Human-language cause plus a retry; an error screen always keeps
 * one way out, so pass altLabel when retry may not help.
 */
export interface ErrorStateProps {
  title?: string;
  body?: string;
  retryLabel?: string;
  onRetry?: () => void;
  /** the escape hatch, e.g. "Qo'lda qo'shish" */
  altLabel?: string;
  onAlt?: () => void;
  /** compact red-topped strip pinned under a form (save failures) */
  inline?: boolean;
  style?: React.CSSProperties;
}
export declare function ErrorState(props: ErrorStateProps): JSX.Element;
