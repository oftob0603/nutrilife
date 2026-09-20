import * as React from 'react';

export interface SidebarNavItem {
  id: string;
  label: string;
  /** Lucide glyph name. */
  icon?: string;
  /** Pending-work count; rendered as an accent pill, hidden at 0. */
  count?: number;
}

export interface SidebarNavProps {
  items?: SidebarNavItem[];
  /** Id of the active section. */
  value?: string;
  onChange?: (id: string) => void;
  /** Wordmark at the top — plain type, no logo file exists. */
  brand?: string;
  /** Bottom slot, e.g. the signed-in admin. */
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Permanent left rail for the admin panel — the eight sections of admin-tz §2, each able
 * to carry a pending count. Desktop only; the panel is not a Mini App screen.
 */
export declare function SidebarNav(props: SidebarNavProps): React.ReactElement;
