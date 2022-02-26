import * as React from 'react';
import { IReduxContext } from './IReduxContext';
import { ReduxContext } from './ReduxContext';

export function ReduxComponentProviderExtension(props: { children(reduxContext: IReduxContext): React.ReactElement }) {
  const { children } = props;

  return <ReduxContext.Consumer>{(reduxContext): React.ReactElement => children(reduxContext)}</ReduxContext.Consumer>;
}
