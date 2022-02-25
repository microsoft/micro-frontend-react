import { Context, createContext } from 'react';
import { IComponentContext } from '../Models';

export const ComponentContext: Context<IComponentContext> = createContext<IComponentContext>({} as IComponentContext);
