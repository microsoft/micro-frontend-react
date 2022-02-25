import * as React from 'react';
import { IComponentConfig, IComponentProps, IComponentContext, IReduxContext } from '../../Models';

export interface IComponentProviderProps {
  config: IComponentConfig;
  data?: { [key: string]: unknown };
  resource?: string;
  scopes?: string[];

  renderError?(): React.ReactElement;

  renderPlaceholder?(): React.ReactElement;
}

export interface IComponentProviderState {
  Component: React.ComponentType<IComponentProps> | null;
  hasError: boolean;
}

export interface ICombinedContext {
  componentContext: IComponentContext;
  reduxContext: IReduxContext;
}

declare global {
  interface Window {
    __WIDGETS__: {
      [key: string]: {
        [key: string]: React.ComponentType<IComponentProps>;
      };
    };
  }
}
