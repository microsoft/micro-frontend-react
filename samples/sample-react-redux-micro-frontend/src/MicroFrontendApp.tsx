import * as React from 'react';
import { Context, withContext } from '@microsoft/micro-frontend-react/lib/Context';
import { IDefaultState } from '@microsoft/micro-frontend-react-redux/lib/IDefaultState';
import { useDynamicReducer } from '@microsoft/micro-frontend-react-redux/lib/useDynamicReducer';
import { IReduxContext } from '@microsoft/micro-frontend-react-redux/lib/IReduxContext';
import {
  MicroFrontendActionType,
  microFrontendReducer,
  microFrontendSagas,
  MicroFrontendState,
} from './SampleMicroFrontendReduxStore';

type AppState = IDefaultState & {
  host: { hostAppName: string };
  dynamic: {
    microFrontend?: MicroFrontendState;
  };
};

function MicroFrontendApp(): React.ReactElement {
  useDynamicReducer('microFrontend', microFrontendReducer, [microFrontendSagas]);

  const { useSelector, dispatch } = React.useContext(Context as React.Context<IReduxContext>);

  const hostAppName = useSelector((appState: AppState) => appState.host.hostAppName);
  const userName = useSelector((appState: AppState) => appState.dynamic.microFrontend?.user?.name ?? 'guest');

  React.useEffect(() => {
    dispatch({
      type: MicroFrontendActionType.REQUEST_USER,
    });
  }, [dispatch]);

  return (
    <div
      style={{
        backgroundColor: '#ff6384',
      }}
    >
      Hello {hostAppName} and {userName}, from {__APP_NAME__}
    </div>
  );
}

const connected = withContext(MicroFrontendApp);
export { connected as MicroFrontendApp };
