import * as React from 'react';
import { ComponentProvider } from '@microsoft/micro-frontend-react/lib/ComponentProvider';
import { Context } from '@microsoft/micro-frontend-react/lib/Context';
import { IReduxContext } from '@microsoft/micro-frontend-react-redux/lib/IReduxContext';
import { AppState } from './App';

export function Home(): React.ReactElement {
  const { useSelector } = React.useContext(Context as React.Context<IReduxContext>);

  const hostAppName = useSelector((appState: AppState) => appState.host.hostAppName);

  return (
    <>
      <div
        style={{
          backgroundColor: 'rgb(54, 162, 235)',
        }}
      >
        Hello from {hostAppName}
      </div>

      <ComponentProvider
        config={{
          script: 'http://localhost:8000/bundles/micro-frontend-app.js',
          name: 'MicroFrontendApp',
        }}
      />
    </>
  );
}
