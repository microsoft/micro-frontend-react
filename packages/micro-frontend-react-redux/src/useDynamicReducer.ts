import { useLayoutEffect, useContext, Context as ReactContext } from 'react';
import { Reducer } from 'redux';
import { Saga } from 'redux-saga';
import { Context } from '@microsoft/micro-frontend-react/lib/Context';
import { IReduxContext } from './IReduxContext';

export function useDynamicReducer(
  reducerName: string,
  reducer: Reducer,
  sagas: Saga[] = [],
  shouldPersist = true
): void {
  const { reducerRegistry, runSaga } = useContext(Context as ReactContext<IReduxContext>);

  useLayoutEffect(() => {
    if (!reducerRegistry.exists(reducerName)) {
      const skipIfExists = true;
      reducerRegistry.registerDynamic(reducerName, reducer, skipIfExists, shouldPersist);

      sagas.map((saga) => runSaga(saga));
    }
  }, [reducer, reducerName, reducerRegistry, runSaga, sagas, shouldPersist]);
}
