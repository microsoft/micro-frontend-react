import { IButtonProps as IFabricButtonProps } from '@fluentui/react/lib/Button';

export interface IButtonProps extends Pick<IFabricButtonProps, Exclude<keyof IFabricButtonProps, 'title'>> {
  title: string;
}
