import * as React from 'react';

export interface StatTileProps {
  label: string;
  value?: React.ReactNode;
  /** Second line under the number, e.g. the period it covers. */
  caption?: string;
  icon?: string;
  /** Skeleton bar in place of the number (A1 loads this way). */
  loading?: boolean;
  /** Makes the tile a link into the queue it counts. */
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * One number on the admin dashboard (A1) — the four daily counters and the three work
 * queues. Clickable when the number leads somewhere.
 */
export declare function StatTile(props: StatTileProps): React.ReactElement;
