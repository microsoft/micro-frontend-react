import * as React from 'react';
import { Context } from '@micro-frontend-react/core/lib/Context';
import { IEmployeeExperienceContext } from '../IEmployeeExperienceContext';
import { IWithButtonClickLoggingProps } from './withButtonClickLogging.types';
import { UserEvent, EventType, UsageEventName } from '../UsageTelemetry';

// eslint-disable-next-line @typescript-eslint/ban-types
export function withButtonClickLogging<T extends object>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<T & IWithButtonClickLoggingProps> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name;

  function ComponentWithClickLogging(props: T & IWithButtonClickLoggingProps): React.ReactElement {
    const { aiEventName, ...restProps } = props;

    const { telemetryClient, telemetryContext } = React.useContext(
      Context as React.Context<IEmployeeExperienceContext>
    );
    const handleClicked = React.useCallback(
      (e: never): void => {
        const buttonEvent: UserEvent = {
          type: EventType.User,
          eventName: UsageEventName.ButtonClicked,
          subFeature: props.usageEvent.subFeature,
          feature: props.usageEvent.feature,
          subFeatureLevel2: props.usageEvent.subFeatureLevel2,
          featureLocation: props.usageEvent.featureLocation,
        };
        telemetryClient.trackEvent(buttonEvent, {
          ...telemetryContext,
          aiEventName,
          buttonTitle: restProps.title,
          buttonText: restProps.text,
          ...(props.logCustomProperties?.() || {}),
        });

        if (restProps.onClick) restProps.onClick(e);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [telemetryClient, telemetryContext, aiEventName, restProps]
    );
    const rest = restProps as T;
    return <WrappedComponent {...rest} onClick={handleClicked} />;
  }

  ComponentWithClickLogging.displayName = displayName;

  return ComponentWithClickLogging;
}
