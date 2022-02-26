import * as React from 'react';
import { ShellProps } from '../Models';
import { ComponentContext } from '../ComponentContext';
import { ShellStyles } from './Shell.styled';

export function Shell(props: ShellProps): React.ReactElement {
  const { children, ...context } = props;

  return (
    <>
      <ShellStyles />
      <ComponentContext.Provider value={{ ...context }}>{children}</ComponentContext.Provider>
    </>
  );
}
