import * as React from 'react';

export interface SelectOption { value: string; label: string }

export interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  /** Plain strings or {value,label} pairs. */
  options?: (string | SelectOption)[];
  error?: string;
  disabled?: boolean;
  /** Shown when no option matches `value`. */
  placeholder?: string;
  /**
   * Adds an action row at the foot of the list (e.g. "+ Yangi qo'shish").
   * Both this and `onCreate` must be set for the row to appear. Use it for lists admins
   * manage (categories, rejection reasons, extension periods) — not for fixed scales or
   * for filters, where a new value would be meaningless or filter to nothing.
   */
  createLabel?: string;
  onCreate?: () => void;
  style?: React.CSSProperties;
}

/**
 * Dropdown for the admin panel — tariff, dish category, recipe difficulty, filters.
 * A listbox rather than a native <select>: the native option popup is painted by the OS
 * and came back white-on-white in dark mode, so the options are real elements drawing on
 * the same tokens as the panel. That also allows the optional create row.
 * The open list is position:fixed, measured from the trigger, so a card with overflow
 * cannot clip it and it flips above the trigger when the space below is short.
 * The mobile app uses SegmentedControl or OptionRow instead.
 */
export declare function Select(props: SelectProps): React.ReactElement;
