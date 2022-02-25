import { useContext, useEffect, useState } from 'react';
import { ILoginOptions, IUser, TelemetryEvents } from '../Models';
import { ComponentContext } from '../Contexts/ComponentContext';

export function useLoginOnStartup(shouldLogin?: boolean, options: ILoginOptions = {}): [IUser | null] {
    const { authClient, telemetryClient } = useContext(ComponentContext);
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        telemetryClient.trackTrace({ message: TelemetryEvents.SessionStarted });

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
