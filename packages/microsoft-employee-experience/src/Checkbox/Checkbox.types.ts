import { ICheckboxProps as IFabricCheckboxProps } from '@fluentui/react/lib/Checkbox';
import { UsageFeatureProps } from '../UsageTelemetry';

export interface ICheckboxProps extends Pick<IFabricCheckboxProps, Exclude<keyof IFabricCheckboxProps, 'onChange'>> {
  name: string;

  onChange(name: string, value: boolean): void;

  usageEvent: UsageFeatureProps;
  logCustomProperties?: () => {
    [key: string]: unknown;
  };
}
