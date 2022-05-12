import * as React from 'react';
import { Context, withContext } from '@micro-frontend-react/core/lib/Context';

function MicroFrontendApp(): React.ReactElement {
  const { userProvider, customData } = React.useContext(
    Context as React.Context<{
      userProvider: { getUserName(): string };
      customData?: string;
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
      Hello, {userName} from {__APP_NAME__}
      {customData ? ` with ${customData}` : ''}!
    </div>
  );
}

const connected = withContext(MicroFrontendApp);
export { connected as MicroFrontendApp };
