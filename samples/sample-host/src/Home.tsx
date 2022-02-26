import * as React from 'react';
import { IUser } from '@microsoft/micro-frontend/lib/Models/IUser';
import { ComponentProvider } from '@microsoft/micro-frontend/lib/ComponentProvider';
import { ComponentContext } from '@microsoft/micro-frontend/lib/ComponentContext';

export function Home(): React.ReactElement {
  const { authClient } = React.useContext(ComponentContext);
  const [user, setUser] = React.useState<IUser | null>(null);

  React.useEffect(() => {
    authClient.getUser().then(setUser);
  }, [authClient]);

  return (
    <>
      Hello, {user?.name ?? 'guest'} from {__APP_NAME__}!
      <ComponentProvider
        config={{
          script: 'http://localhost:8000/bundles/micro-frontend-app.js',
          name: 'MicroFrontendApp',
        }}
      />
    </>
  );
}
