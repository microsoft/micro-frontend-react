import { useEffect, useContext } from 'react';
import { ComponentContext } from '../Contexts/ComponentContext';
import { UserAttribute, pickUserAttribute } from '../Models';
import { useUser } from './useUser';

export function useUsageTelemetry(): void {
    const { usageClient, telemetryContext } = useContext(ComponentContext);
    const user = useUser();
    const initializeUsage = async (): Promise<void> => {
        const userParams = telemetryContext?.usageUser || ({} as UserAttribute);
        if (usageClient) {
            telemetryContext?.setUsageConfig(usageClient?.getUsageConfig());
        }
        if (user && usageClient) {
            //After the user object is initialized, we can request the usage apis
            const usageUserId = await usageClient?.getUsageUserId();
            const usageUser = pickUserAttribute({
                ...userParams,
                usageUserId,
            });
            telemetryContext?.setUsageUser(usageUser);
        }
    };

    useEffect(() => {
        initializeUsage();
        // eslint-disable-next-line
    }, [user, usageClient]); // Prettier introduces the local initializeUsage which re-renders always
}
