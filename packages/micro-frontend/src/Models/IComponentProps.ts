import { IComponentContext } from './IComponentContext';
import { IComponentConfig } from './IComponentConfig';
import { IReduxContext } from './IReduxContext';
import { CustomProperties } from './CustomProperties';

export interface IComponentProps {
    context: IComponentContext;
    reduxContext: IReduxContext;
    config: IComponentConfig;
    data?: CustomProperties;
}
