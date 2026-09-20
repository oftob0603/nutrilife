import * as React from 'react';

export interface StepProgressProps {
  /** 1-based current step. */
  step?: number;
  /** Total steps in the flow (12 for onboarding O1-O12). */
  total?: number;
  /** Omit to hide the back affordance (O10 has no way back). */
  onBack?: () => void;
  /** Only pass on skippable steps — O7, O8, O9. */
  onSkip?: () => void;
  skipLabel?: string;
  style?: React.CSSProperties;
}

/**
 * Onboarding step header: back button, "12 dan 4" counter and a 4px ink progress track.
 * Sits at the top of every onboarding screen in place of ScreenHeader.
 */
export declare function StepProgress(props: StepProgressProps): React.ReactElement;
