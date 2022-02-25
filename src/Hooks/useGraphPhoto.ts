import { useEffect, useContext, useState } from 'react';
import { GraphPhotoSize } from '../Models';
import { ComponentContext } from '../Contexts/ComponentContext';

export function useGraphPhoto(upn?: string, size?: GraphPhotoSize): string | null {
    const { graphClient, authClient } = useContext(ComponentContext);
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
