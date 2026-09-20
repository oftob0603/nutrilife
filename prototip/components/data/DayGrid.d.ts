import * as React from 'react';

export interface DayGridDay {
  /** Display date for the accessible label. */
  sana?: string;
  /** A day with at least one confirmed food entry. */
  tracked: boolean;
}

export interface DayGridProps {
  /** Oldest first. Booleans are accepted as shorthand for { tracked }. */
  days?: (DayGridDay | boolean)[];
  columns?: number;
  /** Only tracked days are tappable — they open the journal at that date. */
  onDayClick?: (day: DayGridDay | boolean, index: number) => void;
  style?: React.CSSProperties;
}

/**
 * The last-30-days square grid on P1: a tracked day is --aksent, an untracked day is
 * --chegara. No streak-pressure colouring, no warnings about breaking a streak.
 */
export declare function DayGrid(props: DayGridProps): React.ReactElement;
