import * as React from 'react';
import { BaseButton } from '@fluentui/react/lib/Button';
import { UsageFeatureProps } from '../UsageTelemetry';

export interface IWithButtonClickLoggingProps {
  onClick?(e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement | HTMLDivElement | BaseButton, MouseEvent>): void;

  aiEventName?: string;
  text?: string;
  title: string;
  usageEvent: UsageFeatureProps;
  logCustomProperties?: () => {
    [key: string]: unknown;
  };
}
