import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import {createStore, applyMiddleware, Middleware, combineReducers, ReducersMapObject, Reducer, AnyAction} from 'redux';
import { persistReducer, persistStore, PersistConfig } from 'redux-persist';
import { composeWithDevTools } from '@redux-devtools/extension';
import persistStorage from 'redux-persist/es/storage';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import { ReduxLoggerOptions, createLogger } from 'redux-logger';
import { IReducerRegistry, ReducerNames } from './IReducerRegistry';
import { IStoreBuilderResult } from './IStoreBuilderResult';
import { IStoreBuilder, IOptionalPersistConfig } from './IStoreBuilder';
import { IDefaultState } from './IDefaultState';

export class StoreBuilder<T extends IDefaultState> implements IStoreBuilder<T> {
  private readonly initialState: T;
  private readonly reducerRegistery: IReducerRegistry;

  private middlewares: Middleware[] = [];
  private sagaMiddleware: SagaMiddleware | undefined;
  private context: unknown | undefined;
  private persistConfig: PersistConfig<T> = {
    key: 'root',
    storage: persistStorage,
    stateReconciler: autoMergeLevel2,

    // https://github.com/rt2zz/redux-persist/issues/786
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    timeout: null,
  };
  private loggerConfig: ReduxLoggerOptions = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private rootSagas: any[] = [];

  public constructor(reducerRegistery: IReducerRegistry, initialState: T = { dynamic: {} } as T) {
    this.reducerRegistery = reducerRegistery;
    this.initialState = {
      dynamic: { ...initialState.dynamic },
      ...initialState,
    };
  }

  public configureSaga(context: unknown): IStoreBuilder<T> {
    this.context = context;

    this.sagaMiddleware = createSagaMiddleware({
      context: context as object,
    });
    this.middlewares.push(this.sagaMiddleware);

    return this;
  }

  public configureLogger(enableOrOption: boolean | ReduxLoggerOptions | undefined): IStoreBuilder<T> {
    if (enableOrOption !== false) {
      const opt = {
        ...this.loggerConfig,
        ...(typeof enableOrOption !== 'boolean' ? enableOrOption : {}),
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.middlewares.push(createLogger(opt));
    }

    return this;
  }

  public configurePersistor(config: IOptionalPersistConfig<T>): IStoreBuilder<T> {
    this.persistConfig = {
      ...this.persistConfig,
      ...config,
    };

    return this;
  }

  public addMiddleware(middleware: Middleware): IStoreBuilder<T> {
    this.middlewares.push(middleware);

    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public addRootSagas(sagas: any[]): IStoreBuilder<T> {
    this.rootSagas = sagas;

    return this;
  }

  public build(): IStoreBuilderResult<T> {
    if (!this.sagaMiddleware) throw new Error('Saga middleware was not configured.');
    if (!this.context) throw new Error('Contexts must be configured using configureContext method');

    const reducers = this.combine(
      this.reducerRegistery.getReducers(),
      this.reducerRegistery.getDynamicReducers(),
      [],
      this.initialState
    );
    const persistedReducer = persistReducer(this.persistConfig, reducers);
    const ifDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
    const store = createStore(
      persistedReducer,
      this.initialState,
      !ifDev ? applyMiddleware(...this.middlewares) : composeWithDevTools(applyMiddleware(...this.middlewares))
    );
    const persistor = persistStore(store);

    this.reducerRegistery.addChangeListener(
      'default',
      (
        newReducers: ReducersMapObject,
        newDynamicReducers: ReducersMapObject,
        persistBlacklistedDynamicReducers: ReducerNames
      ): void => {
        store.replaceReducer(
          persistReducer(
            this.persistConfig,
            this.combine(newReducers, newDynamicReducers, persistBlacklistedDynamicReducers, store.getState())
          )
        );
        persistor.persist();
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.rootSagas.map((saga) => this.sagaMiddleware!.run(saga));

    return {
      store,
      reducerRegistry: this.reducerRegistery,
      runSaga: this.sagaMiddleware.run,
      context: this.context,
    };
  }

  private combine(
    reducers: ReducersMapObject,
    dynamicReducers: ReducersMapObject,
    persistBlacklistedDynamicReducers: ReducerNames,
    currentState: T | null = null
  ): Reducer {
    const reducerNames = Object.keys(reducers);
    const dynamicReducerNames = Object.keys(dynamicReducers);

    Object.keys(currentState || this.initialState).forEach((item: string): void => {
      if (reducerNames.indexOf(item) === -1) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        reducers[item] = (state = null): {} => state;
      }
    });

    Object.keys((currentState && currentState.dynamic) || {}).forEach((item: string) => {
      if (dynamicReducerNames.indexOf(item) === -1) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        dynamicReducers[item] = (state = null): {} => state;
      }
    });

    if (dynamicReducerNames.length > 0) {
      reducers.dynamic = persistReducer(
        {
          ...this.persistConfig,
          key: `${this.persistConfig.key}.dynamic`,
          whitelist: undefined,
          blacklist: persistBlacklistedDynamicReducers,
        },
        combineReducers(dynamicReducers)
      );
    }

    return combineReducers(reducers);
  }
}
