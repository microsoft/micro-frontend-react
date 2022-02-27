import * as React from 'react';
import { Context, withContext } from '@microsoft/micro-frontend-react/lib/Context';

function MicroFrontendApp(): React.ReactElement {
  const { userProvider } = React.useContext(
    Context as React.Context<{
      userProvider: { getUserName(): string };
    }>
  );
  const [userName, setUserName] = React.useState<string>('Guest');

  React.useEffect(() => {
    const userName = userProvider.getUserName();
    setUserName(userName);
  }, [userProvider]);

  return (
    <div
      style={{
        backgroundColor: '#ff6384',
      }}
    >
      Hello, {userName} from {__APP_NAME__}!
    </div>
  );
}

const connected = withContext(MicroFrontendApp);
export { connected as MicroFrontendApp };
