import { useEffect, useContext, Context as ReactContext } from 'react';
import { Context } from '@micro-frontend-react/core/lib/Context';
import { UserAttribute, pickUserAttribute } from './UsageTelemetry';
import { IEmployeeExperienceContext } from './IEmployeeExperienceContext';
import { useUser } from './useUser';

export function useUsageTelemetry(): void {
  const { usageClient, telemetryContext } = useContext(Context as ReactContext<IEmployeeExperienceContext>);
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
