import { IComponentContext } from './IComponentContext';
import { IComponentConfig } from './IComponentConfig';
import { CustomProperties } from './CustomProperties';

export interface IComponentProps<T = unknown> {
  context: IComponentContext;
  reduxContext: T;
  config: IComponentConfig;
  data?: CustomProperties;
}
