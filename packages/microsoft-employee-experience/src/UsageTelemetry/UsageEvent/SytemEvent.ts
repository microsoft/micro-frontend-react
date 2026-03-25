import { EventType } from '../UsageEvent';

export type SystemEvent = {
    eventName?: string;
    feature?: string;
    subFeature?: string;
    subFeatureLevel2?: string;
    featureLocation?: string;
    timeTaken: number;
    type: EventType.System;
    businessTransactionId?: string;
    experienceResult?: boolean;
};

export const pickSystemEvent = (props: Partial<SystemEvent>): SystemEvent => {
    return (({
        eventName,
        feature,
        subFeature,
        subFeatureLevel2,
        featureLocation,
        timeTaken,
        businessTransactionId,
        experienceResult,
    }): SystemEvent => ({
        type: EventType.System,
        eventName,
        feature,
        subFeature,
        subFeatureLevel2,
        featureLocation,
        timeTaken: timeTaken || 0,
        experienceResult: experienceResult || true,
        businessTransactionId,
    }))(props || {});
};
