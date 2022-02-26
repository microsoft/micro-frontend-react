import * as React from 'react';

const Root = styled.div`
  background-color: rgb(54, 162, 235);
  height: 100%;
`;

export function Layout(props: React.PropsWithChildren<unknown>): React.ReactElement {
  return <Root>{props.children}</Root>;
}
