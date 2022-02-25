import { IComponentProviderProps } from '../ComponentProvider/ComponentProvider.types';
import { CustomProperties } from '../../Models';
import { RouteProps } from 'react-router-dom';

export interface IRouteComponentProviderProps extends IComponentProviderProps, RouteProps {
  isExact?: boolean;
  data?: CustomProperties;
}
