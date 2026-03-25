import { EventType } from '..';

export type UserEvent = {
    feature?: string;
    subFeature?: string;
    subFeatureLevel2?: string;
    featureLocation?: string;
    type: EventType.User;
    businessTransactionId?: string;
    eventName: string;
    experienceResult?: boolean;
    timeTaken?: number;
};

export const pickUserEvent = (props: Partial<UserEvent>): UserEvent => {
    return (({
        businessTransactionId,
        eventName,
        experienceResult,
        feature,
        subFeature,
        subFeatureLevel2,
        featureLocation,
        timeTaken,
    }): UserEvent => ({
        type: EventType.User,
        businessTransactionId,
        eventName: eventName as string,
        experienceResult: experienceResult || true,
        feature,
        subFeature,
        subFeatureLevel2,
        featureLocation,
        timeTaken: timeTaken || 0,
    }))(props || {});
};
