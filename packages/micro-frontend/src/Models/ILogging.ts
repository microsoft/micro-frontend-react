import { UsageFeatureProps } from "./UsageTelemetry/UsageFeatureProps";

export interface ILogging {
    name: string;
    usageEvent: UsageFeatureProps;
    logCustomProperties?: () => {
        [key: string]: unknown;
    };
}
