import * as React from 'react';
import { IComponentContext } from './index';

export type ShellProps = React.PropsWithChildren<IComponentContext>;
export type ShellComponentType = React.ComponentType<ShellProps>;
