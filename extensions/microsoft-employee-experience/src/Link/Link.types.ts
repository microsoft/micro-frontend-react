import { UsageFeatureProps } from '../UsageTelemetry';

export interface ILinkProps {
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
}
