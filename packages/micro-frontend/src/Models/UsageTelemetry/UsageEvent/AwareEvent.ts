import { EventType } from '../index';

export type AwareEvent = {
    type: EventType.Aware;
    timeTaken: number;
    usageUserId: string;
};

export const pickAwareEvent = (props: Partial<AwareEvent>): AwareEvent => {
    return (({ timeTaken, usageUserId }): AwareEvent => ({
        type: EventType.Aware,
        timeTaken: timeTaken || 0,
        usageUserId: usageUserId || 'Error',
    }))(props || {});
};
