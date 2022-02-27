import { IComponentConfig } from './IComponentConfig';

export interface IComponentProps<T = unknown> {
  config: IComponentConfig;
  context: T;
}
