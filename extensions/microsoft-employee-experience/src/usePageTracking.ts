import { useEffect, useContext, Context as ReactContext } from 'react';
import { Context } from '@micro-frontend-react/core/lib/Context';
import { IEmployeeExperienceContext } from './IEmployeeExperienceContext';
import { UserEvent, UsageEventName } from './UsageTelemetry';

export function usePageTracking(pageEvent: UserEvent, loadComplete?: () => boolean): void {
  const { telemetryClient, telemetryContext } = useContext(Context as ReactContext<IEmployeeExperienceContext>);
  pageEvent.eventName = pageEvent.eventName || UsageEventName.PageLoad;
  if (pageEvent.eventName !== UsageEventName.PageLoad) {
    telemetryClient.trackException({
      exception: new Error(`Unexpected eventName: ${pageEvent.eventName}. Expected ${UsageEventName.PageLoad}`),
    });
  }
  const pageName = pageEvent.feature ? pageEvent.feature + '-' : pageEvent.subFeature;
  useEffect(() => {
    telemetryClient.startTrackPage(pageName);
    return (): void => {
      telemetryClient.stopTrackPage(pageName);
    };
  }, [pageName, telemetryClient]);
  useEffect(() => {
    if (pageEvent) {
      if (loadComplete) {
        if (loadComplete()) {
          if (telemetryContext) telemetryClient.stopTrackEvent(pageEvent);
        } else {
          if (telemetryContext) telemetryClient.startTrackEvent(pageEvent);
        }
      } else {
        if (telemetryContext) telemetryClient.trackEvent(pageEvent);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadComplete ? loadComplete() : false]);
}
