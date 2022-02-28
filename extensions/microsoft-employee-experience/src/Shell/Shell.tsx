import * as React from 'react';
import { Context } from '@micro-frontend-react/core/lib/Context';
import { ShellStyles } from './Shell.styled';
import { IEmployeeExperienceContext } from '../IEmployeeExperienceContext';

export function Shell(props: React.PropsWithChildren<IEmployeeExperienceContext>): React.ReactElement {
  const { children, ...context } = props;

  return (
    <>
      <ShellStyles />
      <Context.Provider value={{ ...context }}>{children}</Context.Provider>
    </>
  );
}
