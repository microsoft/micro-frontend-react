import { useLayoutEffect, useContext } from 'react';
import { Reducer } from 'redux';
import { ReduxContext } from './ReduxContext';

export function useDynamicReducer(
  reducerName: string,
  reducer: Reducer,
  sagas: any[] = [],
  shouldPersist = true
): void {
  const { reducerRegistry, runSaga } = useContext(ReduxContext);

  useLayoutEffect(() => {
    if (!reducerRegistry.exists(reducerName)) {
      const skipIfExists = true;
      reducerRegistry.registerDynamic(reducerName, reducer, skipIfExists, shouldPersist);

      sagas.map((saga) => runSaga(saga));
    }
  }, [reducer, reducerName, reducerRegistry, runSaga, sagas, shouldPersist]);
}
