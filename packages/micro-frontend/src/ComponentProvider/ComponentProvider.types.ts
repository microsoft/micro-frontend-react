import * as React from 'react';
import { IComponentConfig, IComponentProps } from '../Models';

export interface IComponentProviderProps<T = unknown> {
  config: IComponentConfig;
  data?: { [key: string]: unknown };
  resource?: string;
  scopes?: string[];
  extension?: React.ComponentType<{ children(extension: T): React.ReactElement }>;

  renderError?(): React.ReactElement;

  renderPlaceholder?(): React.ReactElement;
}

export interface IComponentProviderState {
  Component: React.ComponentType<IComponentProps> | null;
  hasError: boolean;
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
