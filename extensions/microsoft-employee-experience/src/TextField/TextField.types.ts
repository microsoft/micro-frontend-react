import { ITextFieldProps as IFabricTextFieldProps } from '@fluentui/react/lib/TextField';
import { UsageFeatureProps } from '../UsageTelemetry';

export interface ITextFieldProps extends Pick<IFabricTextFieldProps, Exclude<keyof IFabricTextFieldProps, 'onChange'>> {
  name: string;
  onChange(name: string, value: string): void;
  usageEvent: UsageFeatureProps;
  logCustomProperties?: () => {
    [key: string]: unknown;
  };
}
