import { ComponentContext } from '@microsoft/micro-frontend/lib/Contexts/ComponentContext';
import { IUser } from '@microsoft/micro-frontend/lib/Models';
import { withContext } from '@microsoft/micro-frontend/lib/withContext';
import * as React from 'react';

const Root = styled.div`
  display: block;
  background-color: #ff6384;
`;

function MicroFrontendApp(): React.ReactElement {
  const { authClient } = React.useContext(ComponentContext);
  const [user, setUser] = React.useState<IUser | null>(null);

  React.useEffect(() => {
    authClient.getUser().then(setUser);
  }, [authClient]);

  return (
    <Root>
      Hello, {user?.name ?? 'guest'} from {__APP_NAME__}!
    </Root>
  );
}

const connected = withContext(MicroFrontendApp);
export { connected as MicroFrontendApp };
