import { UsageFeatureProps } from '../UsageTelemetry';
import * as React from 'react';

export interface ILinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement | HTMLButtonElement | HTMLElement>,
    Omit<React.ButtonHTMLAttributes<HTMLAnchorElement | HTMLButtonElement | HTMLElement>, 'type'>,
    React.RefAttributes<HTMLElement> {
  to: string;
  title: string;
  exact?: boolean;
  target?: '_blank' | '_self';
  // eslint-disable-next-line @typescript-eslint/ban-types
  activeStyle?: {};
  className?: string;
  activeClassName?: string;
  disabled?: boolean;
  refresh?: boolean;
  usageEvent: UsageFeatureProps;
  logCustomProperties?: () => {
    [key: string]: unknown;
  };
  ariaLabel: string;
  onClick: () => void;
}