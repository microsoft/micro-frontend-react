import { useEffect, useContext, useState, Context as ReactContext } from 'react';
import { Context } from '@micro-frontend-react/core/lib/Context';
import { IEmployeeExperienceContext } from './IEmployeeExperienceContext';
import { GraphPhotoSize } from './IGraphClient';

export function useGraphPhoto(upn?: string, size?: GraphPhotoSize): string | null {
  const { graphClient, authClient } = useContext(Context as ReactContext<IEmployeeExperienceContext>);
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (upn) {
      graphClient.getPhoto(upn, size).then(setPhoto);

      return;
    }

    authClient
      .getUserId()
      .then((userId: string | null): void => {
        if (userId) graphClient.getPhoto(userId).then(setPhoto);
        else setPhoto(null);
      })
      .catch(() => {
        setPhoto(null);
      });
  }, [authClient, graphClient, upn]);

  return photo;
}
