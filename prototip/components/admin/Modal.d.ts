import * as React from 'react';

export interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  /** One line stating what will happen — required wording for destructive actions. */
  description?: string;
  children?: React.ReactNode;
  /** 720px instead of 480px — for the three-column suggestion review. */
  wide?: boolean;
  confirmLabel?: string;
  onConfirm?: () => void;
  /** Keeps the confirm button off until the guard is satisfied (e.g. the typed name). */
  confirmDisabled?: boolean;
  /** Red confirm button — irreversible actions only. */
  danger?: boolean;
  cancelLabel?: string;
  style?: React.CSSProperties;
}

/**
 * Centred desktop dialog for the admin panel: grant PRO, block, delete, change prices.
 * admin-tz §4 requires one for every irreversible action, and the consequence must be
 * written in it. The mobile app uses BottomSheet instead — never this.
 */
export declare function Modal(props: ModalProps): React.ReactElement;
