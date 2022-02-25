import {
    IAppInsights,
    IConfig,
    IDependencyTelemetry,
    IConfiguration,
    IEventTelemetry,
    IPageViewTelemetry,
    ITelemetryItem,
} from '@microsoft/applicationinsights-web';
import { IUTPConfig } from './IUTPConfig';
import { UsageTelemetryConfig } from './UsageTelemetry';
import { UsageEvent } from './UsageTelemetry';
import { ITelemetryContext } from './ITelemetryContext';
import { CustomProperties } from './CustomProperties';

export type TelemetryConfig = IConfig &
    IConfiguration &
    IUTPConfig & {
        defaultProperties?: CustomProperties;
        usageTelemetryConfig?: UsageTelemetryConfig;
    };

export interface ITelemetryClient extends Omit<IAppInsights, 'getCookieMgr'> {
    trackDependencyData(dependency: IDependencyTelemetry): void;

    getChildInstance(
        config?: TelemetryConfig,
        correlationId?: string,
        telemetryContext?: ITelemetryContext
    ): ITelemetryClient;

    setContext(context: ITelemetryContext): void;

    getCorrelationId(): string;

    setAuthenticatedUserContext(
        authenticatedUserId: string,
        accountId?: string,
        storeInCookie?: boolean
    ): void;

    /**
     * @deprecated Logs that a page, or similar container was displayed to the user.
     * @param {IPageViewTelemetry} pageView
     * @memberof Initialization
     */
    trackPageView(pageView?: IPageViewTelemetry): void;

    /**
     * Logs that a page, or similar container was displayed to the user.
     * @param {IPageViewTelemetry} pageView
     * @memberof Initialization
     */
    /**
     * @deprecated Use stopTrackEvent( name: UsageEvent ...
     */
    stopTrackEvent(
        name: string,
        properties?: Record<string, unknown>,
        measurements?: Record<string, unknown>
    ): unknown;

    stopTrackEvent(
        usageEvent: UsageEvent,
        props?: Record<string, unknown>,
        measures?: Record<string, unknown>
    ): UsageEvent | undefined;

    /**
     * @deprecated Use startTrackEvent( usageEvent: UsageEvent ...
     */
    startTrackEvent(name: string): unknown;

    startTrackEvent(usageEvent: UsageEvent): unknown;

    trackCustomEvent(
        event: IEventTelemetry,
        customProperties?: CustomProperties
    ): void;

    /**
     * @deprecated Use trackEvent( name: UsageEvent ...
     * Log a user action or other occurrence.
     *
     * @param {IEventTelemetry} event Identifies the event. Events with the same name are counted and can be charted in Metric Explorer.
     * @param {object} customProperties Property bag to log OBJECTS and their key/value pairs into "properties" (works with sub-objects)
     */
    trackEvent(
        event: IEventTelemetry,
        customProperties?: {
            [key: string]: unknown;
        }
    ): unknown;

    /**
     * Log a user action or other occurrence.
     *
     * @param {IEventTelemetry & UsageEvent} event Identifies the event. Events with the same name are counted and can be charted in Metric Explorer.
     * @param {object} customProperties Property bag to log OBJECTS and their key/value pairs into "properties" (works with sub-objects)
     */
    trackEvent(
        event: IEventTelemetry & UsageEvent,
        customProperties?: CustomProperties
    ): unknown;

    /**
     * Log a user action or other occurrence.
     *
     * @param {UsageEvent} event Identifies the event. Events with the same name are counted and can be charted in Metric Explorer.
     * @param {object} customProperties Property bag to log OBJECTS and their key/value pairs into "properties" (works with sub-objects)
     */
    trackEvent(
        event: UsageEvent,
        customProperties?: {
            [key: string]: unknown;
        }
    ): unknown;

    /**
     * Log a user action or other occurrence.
     *
     * @param {telemetryInitializer} function that receives the telemetry item and adds/updates the attributes of the telemetry data.
     */
    addTelemetryInitializer(
        telemetryInitializer: (item: ITelemetryItem) => boolean | void
    ): void;
}
