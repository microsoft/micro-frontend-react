import { ReactReduxContext, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { IReducerRegistry } from './IReducerRegistry';
import { Saga, Task } from 'redux-saga';

export interface IReduxContext {
  reducerRegistry: IReducerRegistry;

  runSaga<S extends Saga<unknown[]>>(saga: S, ...args: Parameters<S>): Task;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: Dispatch<any>;
  useSelector: typeof useSelector;
  __redux_context__: typeof ReactReduxContext;
}
