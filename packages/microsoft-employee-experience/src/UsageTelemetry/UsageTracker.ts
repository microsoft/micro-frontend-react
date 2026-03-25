import { EventType } from './UsageEvent';

export type UsageTracker = {
    name?: string;
    actionTrackingId?: string;
    correlationTrackingId?: string;
    pageTrackingId?: string;
    startTime?: Date;
    eventDate?: Date;
    type: string;
    flightId?: string; // TODO: Move this to a different action => Flighting Action
    flightName?: string; // TODO: Move this to a different action => Flighting Action
    moduleName?: string;
    usageUserId?: string;
    usageVersion?: string;
    inheritedName?: string;
};

export const pickUsageTracker = (
    props: Partial<UsageTracker>
): UsageTracker => {
    return (({
        name,
        actionTrackingId,
        correlationTrackingId,
        pageTrackingId,
        startTime,
        eventDate,
        type,
        flightId,
        flightName,
        moduleName,
        usageUserId,
    }): UsageTracker => ({
        name,
        actionTrackingId,
        correlationTrackingId,
        pageTrackingId,
        startTime: startTime || new Date(),
        eventDate: eventDate || new Date(),
        type: type || EventType.User, // Default the type to user when the type is not passed in
        flightId,
        flightName,
        moduleName,
        usageUserId,
    }))(props || {});
};
