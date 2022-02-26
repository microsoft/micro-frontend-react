import { Context, createContext } from 'react';
import { IReduxContext } from './IReduxContext';

export const ReduxContext: Context<IReduxContext> = createContext<IReduxContext>({} as IReduxContext);
