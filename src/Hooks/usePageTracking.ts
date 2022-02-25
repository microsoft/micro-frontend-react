import { useEffect, useContext } from 'react';
import { ComponentContext } from '../Contexts/ComponentContext';
import { UserEvent, UsageEventName } from '../Models';

export function usePageTracking(pageEvent: UserEvent, loadComplete?: () => boolean): void {
    const { telemetryClient, telemetryContext } = useContext(ComponentContext);
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
