import * as React from 'react';

export interface ProLockProps {
  /** What is behind the lock, stated plainly — never "Upgrade now". */
  title: string;
  /** One line naming what the user gets. Omit in compact mode. */
  caption?: string;
  cta?: string;
  /** Opens the tariffs screen. Omit to render an inert notice. */
  onUnlock?: () => void;
  /** One 44px row with a lock glyph and a PRO badge — for locking a block inline. */
  compact?: boolean;
  style?: React.CSSProperties;
}

/**
 * The standard PRO gate. Replaces the content a FREE user cannot see and says what is
 * behind it. Used for the macro block, the meal suggestion and the recipe detail.
 * Never a dialog and never an interstitial — the surrounding screen stays usable.
 */
export declare function ProLock(props: ProLockProps): React.ReactElement;
