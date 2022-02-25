import * as React from 'react';
import { IComponentContext, IStoreBuilderResult } from './';
import { History } from 'history';

// eslint-disable-next-line @typescript-eslint/ban-types
export type ShellProps = React.PropsWithChildren<any>;
export type ShellComponentType = React.ComponentType<ShellProps>;

export interface IShellProps<T> {
    store: IStoreBuilderResult<T>;
    history: History;
    context: IComponentContext;
    appName: string;
}
