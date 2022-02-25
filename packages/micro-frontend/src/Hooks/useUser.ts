import { useEffect, useContext, useState } from 'react';
import { IUser } from '../Models';
import { ComponentContext } from '../Contexts/ComponentContext';

export function useUser(): IUser | null {
    const { authClient } = useContext(ComponentContext);
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        authClient.getUser().then(setUser);
    }, [authClient]);

    return user;
}
