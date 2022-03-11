import * as React from 'react';
import { CoherenceNav } from '@coherence-design-system/controls/lib/nav';
import { Context } from '@micro-frontend-react/employee-experience/lib/Context';
import { UserEvent, EventType, UsageEventName } from '@micro-frontend-react/employee-experience/lib/UsageTelemetry';
import { IEmployeeExperienceContext } from '@micro-frontend-react/employee-experience/lib/IEmployeeExperienceContext';
import { INavProps } from './Nav.types';
import { useCoherenceNavGroups } from './useCoherenceNavGroups';

export function Nav(props: INavProps): React.ReactElement {
  const { groups, defaultIsNavCollapsed, appName, ...otherProps } = props;
  const { telemetryClient } = React.useContext(Context as React.Context<IEmployeeExperienceContext>);
  const coherenceNavGroups = useCoherenceNavGroups(groups);

  const onToggle = (isOpen: boolean) => {
    const navigationEvent: UserEvent = {
      subFeature: `Navigation.SideNav.${isOpen ? 'Open' : 'Close'}`,
      type: EventType.User,
      eventName: UsageEventName.LinkClicked,
    };

    telemetryClient.trackEvent(navigationEvent, { ...props });

    if (props.onNavCollapsed) props.onNavCollapsed(isOpen);
  };

  return (
    <CoherenceNav
      {...otherProps}
      appName={appName || ''}
      groups={coherenceNavGroups}
      onNavCollapsed={(isOpen: boolean) => onToggle(isOpen)}
      defaultIsNavCollapsed={defaultIsNavCollapsed === undefined ? true : defaultIsNavCollapsed}
      telemetryHook={telemetryClient}
    />
  );
}
