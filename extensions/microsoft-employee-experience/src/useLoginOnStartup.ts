import { useContext, useEffect, useState, Context as ReactContext } from 'react';
import { Context } from '@micro-frontend-react/core/lib/Context';
import { IUser } from './IUser';
import { ILoginOptions } from './IAuthClient';
import { IEmployeeExperienceContext } from './IEmployeeExperienceContext';

export function useLoginOnStartup(shouldLogin?: boolean, options: ILoginOptions = {}): [IUser | null] {
  const { authClient, telemetryClient } = useContext(Context as ReactContext<IEmployeeExperienceContext>);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    telemetryClient.trackTrace({ message: 'SessionStarted' });

    if (user) return telemetryClient.setAuthenticatedUserContext(user.id);
  }, []);

  useEffect(() => {
    if (shouldLogin === false) return;
    if (user) return telemetryClient.setAuthenticatedUserContext(user.id);

    authClient
      .isLoggedIn()
      .then(async (isLoggedIn): Promise<void> => {
        if (isLoggedIn) {
          const loggedInUser = await authClient.getUser();
          setUser(loggedInUser);

          return;
        }

        authClient.login(options).catch();
      })
      .catch(() => {
        authClient.login(options).catch();
      });
  }, [authClient, shouldLogin, telemetryClient, user]);

  return [user];
}
