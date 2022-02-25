import { CustomProperties } from '../../CustomProperties';

const CuppSchema: { [key: string]: string } = {
    type: 'UsageEventType',
    timeTaken: 'UsageTimeTaken',
    eventName: 'UsageEventName',
    feature: 'UsageCapabilityName',
    subFeature: 'UsageSubCapabilityName',
    subFeatureLevel2: 'UsageSubCapabilityLevel2',
    featureLocation: 'UsageLocation',
    businessTransactionId: 'UsageBusinessTransactionId',
    experienceResult: 'UsageExperienceResult',
    usageUserId: 'UsageUserId',
    sessionId: 'UsageSessionId', // TOOD:  ras1 => UsageSessionTrackingId ?
    actionTrackingId: 'UsageActionTrackingId',
    correlationTrackingId: 'UsagecCorrelationTrackingId',
    pageTrackingId: 'UsagePageTrackingId',
    eventDate: 'UsageEventDate',
    flightId: 'UsageFlightId',
    flightName: 'UsageFlightName',
    moduleName: 'UsageModuleName',
    usageVersion: 'UsageVersion',
};

export const asCuppSchema = (props: CustomProperties): CustomProperties =>
    Object.keys(props).reduce(
        (acc, key: string) => ({
            ...acc,
            ...{
                [CuppSchema[key] || key]:
                    props[key] instanceof Date
                        ? (props[key] as Date).toISOString()
                        : props[key] !== undefined
                        ? props[key]
                        : '',
            },
        }),
        {}
    );
