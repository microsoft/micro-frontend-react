import * as React from 'react';
import { useDynamicReducer } from '@microsoft/micro-frontend-redux/lib/useDynamicReducer';
import { IDefaultState } from '@microsoft/micro-frontend-redux/lib/IDefaultState';
import { withReduxContext } from '@microsoft/micro-frontend-redux/lib/withReduxContext';
import { ReduxContext } from '@microsoft/micro-frontend-redux/lib/ReduxContext';
import {
  MicroFrontendActionType,
  microFrontendReducer,
  microFrontendSagas,
  MicroFrontendState,
} from './SampleMicroFrontendReduxStore';

const Root = styled.div`
  display: block;
  background-color: #ff6384;
`;

type AppState = IDefaultState & {
  host: { hostAppName: string };
  dynamic: {
    microFrontend?: MicroFrontendState;
  };
};

function MicroFrontendApp(): React.ReactElement {
  useDynamicReducer('microFrontend', microFrontendReducer, [microFrontendSagas]);

  const { useSelector, dispatch } = React.useContext(ReduxContext);

  const hostAppName = useSelector((appState: AppState) => appState.host.hostAppName);
  const userName = useSelector((appState: AppState) => appState.dynamic.microFrontend?.user?.name ?? 'guest');

  React.useEffect(() => {
    dispatch({
      type: MicroFrontendActionType.REQUEST_USER,
    });
  }, [dispatch]);

  return (
    <Root>
      Hello {hostAppName}, from {userName}
    </Root>
  );
}

const connected = withReduxContext(MicroFrontendApp);
export { connected as MicroFrontendApp };
