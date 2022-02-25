import { ComponentType } from 'react';
import { IComponentConfig } from './IComponentConfig';
import { IComponentProps } from './IComponentProps';

export interface IComponentLoader {
    loadCommon(script: string): Promise<void>;
    load(config: IComponentConfig): Promise<ComponentType<IComponentProps>>;
    loadSecured(
        config: IComponentConfig,
        resourceOrScopes: string | string[] | undefined
    ): Promise<ComponentType<IComponentProps>>;
}
