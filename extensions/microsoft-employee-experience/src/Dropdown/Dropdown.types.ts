import { IDropdownProps as IFabricDropdownProps } from '@fluentui/react/lib/Dropdown';
import { UsageFeatureProps } from '../UsageTelemetry';

export interface IDropdownProps extends Pick<IFabricDropdownProps, Exclude<keyof IFabricDropdownProps, 'onChange'>> {
  name: string;

  onChange(name: string, value: string | number): void;

  usageEvent: UsageFeatureProps;
  logCustomProperties?: () => {
    [key: string]: unknown;
  };
}
