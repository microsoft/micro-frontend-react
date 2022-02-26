import { Store } from 'redux';
import { Task, Saga } from 'redux-saga';
import { IComponentContext } from '@microsoft/micro-frontend/lib/Models/IComponentContext';
import { IReducerRegistry } from './IReducerRegistry';

// eslint-disable-next-line @typescript-eslint/ban-types
export interface IStoreBuilderResult<T extends {}> {
  store: Store<T>;
  reducerRegistry: IReducerRegistry;
  runSaga<S extends Saga<unknown[]>>(saga: S, ...args: Parameters<S>): Task;
  context: IComponentContext;
}
