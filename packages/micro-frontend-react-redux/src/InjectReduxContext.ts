import { ReactReduxContext, useSelector } from 'react-redux';
import { IReduxContext } from './IReduxContext';
import { IStoreBuilderResult } from './IStoreBuilderResult';

export function injectReduxContext<T>(storeBuilderResult: IStoreBuilderResult<T>): IReduxContext {
  const { store, ...otherResults } = storeBuilderResult;

  return {
    dispatch: store.dispatch,
    useSelector,
    __redux_context__: ReactReduxContext,
    ...otherResults,
  };
}
