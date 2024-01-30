import * as AI from '@microsoft/applicationinsights-web';
import { deviceDetect } from 'react-device-detect';
import { ITelemetryClient, TelemetryConfig, Measurements, CustomProperties } from './ITelemetryClient';
import { ITelemetryContext } from './ITelemetryContext';
import { UsageEvent, asCuppSchema, UsageTracker, SystemEvent, EventType } from './UsageTelemetry';
import { v4 as guid } from 'uuid';

export class TelemetryClient implements ITelemetryClient {
  private readonly appInsights: AI.ApplicationInsights;
  private readonly correlationId: string;
  private readonly config: TelemetryConfig;
  private telemetryContext: ITelemetryContext | undefined;

  public constructor(config: TelemetryConfig, correlationId?: string, appInsights?: AI.ApplicationInsights) {
    this.correlationId = correlationId || guid();
    if (!appInsights) {
      appInsights = new AI.ApplicationInsights({
        config: config as AI.IConfig,
      });
      const deviceInfo = deviceDetect(window.navigator.userAgent);
      appInsights.loadAppInsights();
      appInsights.addTelemetryInitializer((item: AI.ITelemetryItem) => {
        item.data = {
          ...item.data,
          correlationId: this.correlationId,
          location: window.location.href.split('#')[0],
          telemetrySource: 'UI',
          ...config.UTPConfig,
          ...config.defaultProperties,
          ...deviceInfo,
        };
        if (item.data) {
          item.data = asCuppSchema(item.data);
        }
        if (item.baseData?.properties) {
          item.baseData.properties = asCuppSchema(item.baseData.properties);
        }
      });
    }
    this.appInsights = appInsights;
    this.config = config;
  }

  public trackPageView(pageView: AI.IPageViewTelemetry & UsageEvent): void {
    this.appInsights.trackPageView(pageView);
  }

  public startTrackPage(name?: string | undefined): void {
    this.appInsights.startTrackPage(name);
  }

  public trackPageViewPerformance(pageViewPerformance: AI.IPageViewPerformanceTelemetry): void {
    this.appInsights.trackPageViewPerformance(pageViewPerformance);
  }

  public trackEvent(event: AI.IEventTelemetry, customProperties?: CustomProperties): void;
  public trackEvent(event: UsageEvent, customProperties?: CustomProperties): void;
  public trackEvent(event: AI.IEventTelemetry & UsageEvent, customProperties?: CustomProperties): void {
    const usageEvent = this.telemetryContext?.setUsageEvent(event);
    this.appInsights.trackEvent({ ...event, ...usageEvent } as AI.IEventTelemetry, {
      ...usageEvent,
      ...customProperties,
    });
  }

  public trackCustomEvent(event: AI.IEventTelemetry, customProperties?: CustomProperties): void {
    this.appInsights.trackEvent(
      {
        ...event,
      },
      customProperties
    );
  }

  public setAuthenticatedUserContext(
    authenticatedUserId: string,
    accountId?: string | undefined,
    storeInCookie?: boolean | undefined
  ): void {
    this.appInsights.setAuthenticatedUserContext(authenticatedUserId, accountId, storeInCookie);
  }

  public trackException(exception: AI.IExceptionTelemetry, customProperties?: CustomProperties): void {
    try {
      const emptyEvent = {
        type: EventType.System,
        experienceResult: false,
      } as SystemEvent;
      exception.properties = this.telemetryContext?.setUsageEvent(emptyEvent);
    } catch (error) {
      // Ignore error and log the exception as is.
    }
    this.appInsights.trackException(exception, customProperties);
  }

  public _onerror(exception: AI.IAutoExceptionTelemetry): void {
    this.appInsights._onerror(exception);
  }

  public trackTrace(trace: AI.ITraceTelemetry, customProperties?: CustomProperties): void {
    this.appInsights.trackTrace(trace, customProperties);
  }

  public trackMetric(metric: AI.IMetricTelemetry, customProperties?: CustomProperties): void {
    this.appInsights.trackMetric(metric, customProperties);
  }

  public stopTrackPage(name?: string | undefined, url?: string | undefined, customProperties?: CustomProperties): void {
    this.appInsights.stopTrackPage(name, url, customProperties);
  }

  public startTrackEvent(name: string): void;
  public startTrackEvent(usageEvent: UsageEvent): UsageEvent | undefined;
  public startTrackEvent(name: string | UsageEvent): UsageEvent | undefined {
    if (typeof name === 'string') {
      this.appInsights.startTrackEvent(name);
    }
    if (typeof name !== 'string') {
      const eventName = 'eventName' in name ? (name.eventName || 'PageLoad') + 'Start' : 'PageLoadStart';
      const startEvent = { ...name, eventName };
      const event = this.telemetryContext?.setUsageEvent(startEvent);
      this.appInsights.startTrackEvent((event as UsageTracker).name);
      return event;
    }
  }

  // eslint-disable-next-line prettier/prettier
  public stopTrackEvent(name: string, properties?: CustomProperties, measurements?: Measurements): unknown;
  // eslint-disable-next-line prettier/prettier
  public stopTrackEvent(
    usageEvent: UsageEvent,
    properties?: CustomProperties,
    measurements?: Measurements
  ): UsageEvent | undefined;
  // eslint-disable-next-line prettier/prettier
  public stopTrackEvent(
    name: string | UsageEvent,
    properties?: CustomProperties,
    measurements?: Measurements
  ): UsageEvent | undefined {
    if (typeof name === 'string') {
      this.appInsights.stopTrackEvent(name, properties, measurements);
    } else {
      const telemetryProps: UsageEvent & CustomProperties = {
        ...((name || {}) as UsageEvent),
        ...(properties || {}),
      };
      const e = this.telemetryContext?.setUsageEvent({ ...name });
      const event: UsageEvent & CustomProperties = {
        ...telemetryProps,
        ...e,
      };
      this.appInsights.stopTrackEvent(event.name, event, measurements);

      return event;
    }
  }

  public trackDependencyData(dependency: AI.IDependencyTelemetry): void {
    this.appInsights.trackDependencyData(dependency);
  }

  public addTelemetryInitializer(telemetryInitializer: (item: AI.ITelemetryItem) => boolean | void): void {
    this.appInsights.addTelemetryInitializer(telemetryInitializer);
  }

  public getChildInstance(
    config?: TelemetryConfig,
    correlationId?: string,
    telemetryContext?: ITelemetryContext
  ): ITelemetryClient {
    const childClient = new TelemetryClient(
      config || this.config,
      correlationId || this.correlationId,
      this.appInsights
    );
    if (telemetryContext) {
      childClient.setContext(telemetryContext);
    }
    return childClient as ITelemetryClient;
  }

  public setContext(telemetryContext: ITelemetryContext): void {
    this.telemetryContext = telemetryContext;
  }

  public getCorrelationId(): string {
    return this.correlationId;
  }
}
