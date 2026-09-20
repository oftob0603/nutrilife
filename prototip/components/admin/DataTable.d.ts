import * as React from 'react';

export interface DataTableColumn<R = any> {
  key: string;
  label: string;
  /** CSS grid track, e.g. "2fr" or "120px". Defaults to 1fr. */
  width?: string;
  align?: 'left' | 'right';
  /** tabular numerals for the column */
  numeric?: boolean;
  /** render the cell in --matn-2 */
  muted?: boolean;
  render?: (row: R) => React.ReactNode;
}

export interface DataTableProps<R = any> {
  columns?: DataTableColumn<R>[];
  rows?: R[];
  onRowClick?: (row: R) => void;
  /** Replaces the body with skeleton rows (admin-tz §4: tables load as skeleton rows). */
  loading?: boolean;
  skeletonRows?: number;
  /** Shown in place of the body when there are no rows — pass an EmptyState. */
  empty?: React.ReactNode;
  /** Left/right footer content, typically the 50-per-page pager. */
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * The admin panel's list surface: users, dishes, recipes, complaints and the suggestion
 * queue are all this table. Hairline rows, no zebra striping, no shadow.
 */
export declare function DataTable(props: DataTableProps): React.ReactElement;
