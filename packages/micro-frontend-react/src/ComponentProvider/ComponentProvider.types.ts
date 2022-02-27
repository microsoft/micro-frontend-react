import * as React from 'react';
import { IComponentProps } from '../IComponentProps';
import { IComponentConfig } from '../IComponentConfig';

export interface IDuplicateRequestHandler {
  resolve: (template: React.ComponentType<IComponentProps>) => void;
  reject: (error: Error) => void;
}

export interface IDuplicateRequestHandlers {
  [key: string]: IDuplicateRequestHandler[];
}

export interface IComponentProviderProps {
  config: IComponentConfig;

  onLoad?(config: IComponentConfig): void;

  onLoaded?(config: IComponentConfig): void;

  onError?(error: Error): void;

  renderError?(): React.ReactElement;

  renderPlaceholder?(): React.ReactElement;
}

export interface IComponentProviderState {
  Component: React.ComponentType<IComponentProps> | null;
  hasError: boolean;
}

declare global {
  interface Window {
    __MICRO_FRONTENDS__: {
      [key: string]: {
        [key: string]: React.ComponentType<IComponentProps>;
      };
    };
  }
}
