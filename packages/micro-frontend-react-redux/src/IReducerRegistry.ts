import { ReducersMapObject, AnyAction } from 'redux';

export interface IReducerRegistry {
  getReducers(): ReducersMapObject;

  getDynamicReducers(): ReducersMapObject;

  exists(reducerName: string): boolean;

  register<S, A extends AnyAction>(
    name: string,
    reducer: (state: S, action: A) => S,
    skipIfExists?: boolean
  ): IReducerRegistry;

  registerDynamic<S, A extends AnyAction>(
    name: string,
    reducer: (state: S, action: A) => S,
    skipIfExists?: boolean,
    shouldPersist?: boolean
  ): IReducerRegistry;

  addChangeListener(name: string, fn: ReducerChangeListener): IReducerRegistry;

  removeChangeListener(name: string): IReducerRegistry;
}

export type ReducerNames = string[];

export type ReducerChangeListener = (
  reducers: ReducersMapObject,
  dynamicReducers: ReducersMapObject,
  blacklistedDynamicReducer: ReducerNames
) => void;
