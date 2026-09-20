import * as React from 'react';

export interface WeightPoint {
  /** Display date, already formatted (e.g. "12.09"). */
  sana: string;
  /** ISO day (YYYY-MM-DD) — the x position and the gap arithmetic both come from this. */
  iso: string;
  kg: number;
  /** Stable record id; used for point identity so gaps do not shift selection. */
  id?: number | string;
}

export interface WeightChartProps {
  /** Recorded measurements only. Never pad with missing days or extend to today. */
  points?: WeightPoint[];
  /** Target weight — drawn as a dashed reference line with a label. */
  goal?: number;
  height?: number;
  /** Shown instead of the chart while there is only one measurement. */
  emptyLabel?: string;
  /** Tapping a point reveals its date and value in place — the screen does not change. */
  onPointClick?: (point: WeightPoint, index: number) => void;
  /** Draw-in on mount. Pass false where the screen must render fully static (P1). */
  animate?: boolean;
  style?: React.CSSProperties;
}

/**
 * Weight-over-time line for P1. Ink line, dashed goal line, tappable points.
 * x is a date position, so gaps read as real elapsed time; every recorded measurement
 * connects to the next one however long the gap, and the line stops at the last record so
 * nothing is drawn into the future.
 * No axes, no gridlines, no health bands — progress-tz forbids medical interpretation.
 */
export declare function WeightChart(props: WeightChartProps): React.ReactElement;
