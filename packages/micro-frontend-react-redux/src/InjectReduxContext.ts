import { ReactReduxContext, useSelector } from 'react-redux';
import { IStoreBuilderResult } from './IStoreBuilderResult';

export function injectReduxContext<T>(storeBuilderResult: IStoreBuilderResult<T>) {
  const { store, ...otherResults } = storeBuilderResult;

  return {
    dispatch: store.dispatch,
    useSelector,
    __redux_context__: ReactReduxContext,
    ...otherResults,
  };
}
