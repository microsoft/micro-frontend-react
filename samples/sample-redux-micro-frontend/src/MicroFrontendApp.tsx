import * as React from 'react';
import { IDefaultState } from '@microsoft/micro-frontend-redux/lib/IDefaultState';
import { withReduxContext } from '@microsoft/micro-frontend-redux/lib/withReduxContext';
import { ReduxContext } from '@microsoft/micro-frontend-redux/lib/ReduxContext';

const Root = styled.div`
  display: block;
  background-color: #ff6384;
`;

type AppState = IDefaultState & {
  storeData: { hostAppName: string };
};

function MicroFrontendApp(): React.ReactElement {
  const { useSelector } = React.useContext(ReduxContext);

  const hostAppName = useSelector((appState: AppState) => appState.storeData.hostAppName);

  return <Root>Hello, {hostAppName}</Root>;
}

const connected = withReduxContext(MicroFrontendApp);
export { connected as MicroFrontendApp };
