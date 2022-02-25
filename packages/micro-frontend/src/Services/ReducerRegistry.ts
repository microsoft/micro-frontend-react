import { Reducer, ReducersMapObject, AnyAction } from 'redux';
import { IReducerRegistry, ReducerChangeListener, ReducerNames } from '../Models';

export class ReducerRegistry implements IReducerRegistry {
  private readonly changeListeners: {
    [key: string]: ReducerChangeListener;
  };
  private reducers: ReducersMapObject;
  private dynamicReducers: ReducersMapObject;
  private persistBlacklistedDynamicReducers: ReducerNames = [];

  public constructor() {
    this.changeListeners = {};
    this.reducers = {};
    this.dynamicReducers = {};
  }

  public getReducers(): ReducersMapObject {
    return { ...this.reducers };
  }

  public getDynamicReducers(): ReducersMapObject {
    return { ...this.dynamicReducers };
  }

  public register<S, A extends AnyAction>(
    name: string,
    reducer: (state: S, action: A) => S,
    skipIfExists: boolean | undefined = false
  ): IReducerRegistry {
    if (skipIfExists && this.reducers.hasOwnProperty(name)) return this;

    this.reducers = { ...this.reducers, [name]: reducer as Reducer };

    Object.keys(this.changeListeners).forEach((key: string): void => {
      this.changeListeners[key](this.getReducers(), this.getDynamicReducers(), this.persistBlacklistedDynamicReducers);
    });

    return this;
  }

  public registerDynamic<S, A extends AnyAction>(
    name: string,
    reducer: (state: S, action: A) => S,
    skipIfExists: boolean | undefined = false,
    shouldPersist: boolean | undefined = true
  ): IReducerRegistry {
    if (skipIfExists && this.dynamicReducers.hasOwnProperty(name)) return this;

    this.dynamicReducers[name] = reducer as Reducer;
    if (!shouldPersist) this.persistBlacklistedDynamicReducers.push(name);

    Object.keys(this.changeListeners).forEach((key: string): void => {
      this.changeListeners[key](this.getReducers(), this.getDynamicReducers(), this.persistBlacklistedDynamicReducers);
    });

    return this;
  }

  public exists(reducerName: string): boolean {
    return this.reducers.hasOwnProperty(reducerName) || this.dynamicReducers.hasOwnProperty(reducerName);
  }

  public addChangeListener(name: string, fn: ReducerChangeListener): ReducerRegistry {
    this.changeListeners[name] = fn;

    return this;
  }

  public removeChangeListener(name: string): ReducerRegistry {
    delete this.changeListeners[name];

    return this;
  }
}
