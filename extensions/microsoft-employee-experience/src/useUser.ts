import { useEffect, useContext, useState, Context as ReactContext } from 'react';
import { Context } from '@micro-frontend-react/core/lib/Context';
import { IEmployeeExperienceContext } from './IEmployeeExperienceContext';
import { IUser } from './IUser';

export function useUser(): IUser | null {
  const { authClient } = useContext(Context as ReactContext<IEmployeeExperienceContext>);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    authClient.getUser().then(setUser);
  }, [authClient]);

  return user;
}
