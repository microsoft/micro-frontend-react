import { IDatePickerProps as IFabricDatePickerProps } from '@fluentui/react/lib/DatePicker';
import { UsageFeatureProps } from '../UsageTelemetry';

export interface IDatePickerProps
  extends Pick<IFabricDatePickerProps, Exclude<keyof IFabricDatePickerProps, 'onChange'>> {
  name: string;

  onChange(name: string, value: Date | null): void;

  usageEvent: UsageFeatureProps;
  logCustomProperties?: () => {
    [key: string]: unknown;
  };
}
