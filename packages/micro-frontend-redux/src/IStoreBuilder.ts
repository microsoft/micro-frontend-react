import { Middleware } from 'redux';
import { PersistConfig } from 'redux-persist';
import { ReduxLoggerOptions } from 'redux-logger';
import { PersistedState, PersistMigrate, StateReconciler, Storage, Transform } from 'redux-persist/es/types';
import { IStoreBuilderResult } from './IStoreBuilderResult';
import { IComponentContext } from '@microsoft/micro-frontend/lib/Models/IComponentContext';
import { IDefaultState } from './IDefaultState';

export interface IStoreBuilder<T extends IDefaultState> {
  configureSaga(context: IComponentContext): IStoreBuilder<T>;
  configureLogger(options?: ReduxLoggerOptions): IStoreBuilder<T>;
  configurePersistor(persistConfig: IOptionalPersistConfig<T>): IStoreBuilder<T>;
  addMiddleware(middleware: Middleware): IStoreBuilder<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addRootSagas(sagas: any[]): IStoreBuilder<T>;
  build(): IStoreBuilderResult<T>;
}

export interface IOptionalPersistConfig<S, RS = any, HSS = any, ESS = any> {
  version?: number;
  storage?: Storage;
  key?: string;
  /**
   * @deprecated keyPrefix is going to be removed in v6.
   */
  keyPrefix?: string;
  blacklist?: Array<string>;
  whitelist?: Array<string>;
  transforms?: Array<Transform<HSS, ESS, S, RS>>;
  throttle?: number;
  migrate?: PersistMigrate;
  stateReconciler?: false | StateReconciler<S>;
  /**
   * @desc Used for migrations.
   */
  getStoredState?: (config: PersistConfig<S, RS, HSS, ESS>) => Promise<PersistedState>;
  debug?: boolean;
  serialize?: boolean;
  timeout?: number;
  writeFailHandler?: (err: Error) => void;
}
