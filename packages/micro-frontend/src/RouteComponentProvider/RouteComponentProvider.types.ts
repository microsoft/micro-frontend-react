import { RouteProps } from 'react-router-dom';
import { IComponentProviderProps } from '../ComponentProvider/ComponentProvider.types';
import { CustomProperties } from '../Models';

export interface IRouteComponentProviderProps extends IComponentProviderProps, RouteProps {
  isExact?: boolean;
  data?: CustomProperties;
}
