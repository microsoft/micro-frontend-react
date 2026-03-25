import { UsageHelper } from './Helpers/Usage.helper';

export type UserAttribute = {
    usageUserId: string;
    sessionId: string;
    lastActiveTime: Date | string;
};

export const pickUserAttribute = (
    props: Partial<UserAttribute>
): UserAttribute => {
    return (({ lastActiveTime, usageUserId, sessionId }): UserAttribute => ({
        lastActiveTime: lastActiveTime || new Date(),
        usageUserId: usageUserId || 'Error',
        sessionId: sessionId || UsageHelper.Guid(), // TODO: guid
    }))(props || {});
};
