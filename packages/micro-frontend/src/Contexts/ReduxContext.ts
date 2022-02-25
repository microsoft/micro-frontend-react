import { Context, createContext } from 'react';
import { IReduxContext } from '../Models';

export const ReduxContext: Context<IReduxContext> = createContext<IReduxContext>({} as IReduxContext);
