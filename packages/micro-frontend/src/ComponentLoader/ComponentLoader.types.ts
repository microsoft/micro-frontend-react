import * as React from 'react';
import { IComponentProps } from '../Models';

export interface IDuplicateRequestHandler {
  resolve: (template: React.ComponentType<IComponentProps>) => void;
  reject: (error: Error) => void;
}

export interface IDuplicateRequestHandlers {
  [key: string]: IDuplicateRequestHandler[];
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
