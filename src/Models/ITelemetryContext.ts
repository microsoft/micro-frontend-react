import {
    UsageEvent,
    UserAttribute,
    UsageTelemetryConfig,
} from './UsageTelemetry';
export interface ITelemetryContext {
    sourceComponent: string;
    sourceScript: string;
    setUsageEvent: (usageEvent: UsageEvent) => UsageEvent;
    setUsageUser: (usageUser: UserAttribute) => UserAttribute;
    setUsageConfig: (usageConfig: UsageTelemetryConfig) => void;
    usageUser: (usageUser: UserAttribute) => UserAttribute;
    getChildContext: (appname: string, source: string) => ITelemetryContext;
}
