import * as React from 'react';
import { Context } from '@micro-frontend-react/core/lib/Context';
import { ComponentProvider } from '@micro-frontend-react/core/lib/ComponentProvider';

export function Home(): React.ReactElement {
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
    <>
      <div
        style={{
          backgroundColor: 'rgb(54, 162, 235)',
        }}
      >
        Hello, {userName} from {__APP_NAME__}
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
