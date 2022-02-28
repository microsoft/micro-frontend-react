import * as React from 'react';
import { NavLink as ReactRouterNavLink } from 'react-router-dom';
import { Link as FluentLink } from '@fluentui/react/lib/Link';
import { Context } from '@micro-frontend-react/core/lib/Context';
import { UserEvent, UsageEventName, EventType } from '../UsageTelemetry';
import { IEmployeeExperienceContext } from '../IEmployeeExperienceContext';
import { ILinkProps } from './Link.types';
import { shouldUseAnchorTag } from './Link.utils';

export function Link(props: React.PropsWithChildren<ILinkProps>): React.ReactElement {
  const { to, children, activeStyle, exact, title, className, target, activeClassName, disabled, refresh } = props;
  const { telemetryClient } = React.useContext(Context as React.Context<IEmployeeExperienceContext>);
  const href = to || '/';

  const handleClicked = (): void => {
    const linkEvent: UserEvent = {
      feature: props.usageEvent.feature,
      subFeature: props.usageEvent.subFeature,
      subFeatureLevel2: props.usageEvent.subFeatureLevel2,
      featureLocation: props.usageEvent.featureLocation,
      eventName: UsageEventName.LinkClicked,
      type: EventType.User,
    };
    telemetryClient.trackEvent(linkEvent, {
      properties: { to, title },
      ...(props.logCustomProperties?.() || {}),
    });
  };

  if (shouldUseAnchorTag(href, refresh))
    return (
      <FluentLink
        href={href}
        target={target}
        rel="noopener noreferrer"
        onClick={handleClicked}
        title={title}
        className={className}
        disabled={disabled}
      >
        {children}
      </FluentLink>
    );

  return (
    <FluentLink
      // Work around from OF team:
      // https://teams.microsoft.com/l/message/19:86b094239256467da9dfa96ba0897ca2@thread.skype/1583170159871?tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47&groupId=ffe264f2-14d0-48b5-9384-64f808b81294&parentMessageId=1582822787612&teamName=Microsoft%20UI%20Fabric&channelName=Fabric%20React&createdTime=1583170159871
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      as={ReactRouterNavLink as any}
      to={href}
      activeStyle={activeStyle}
      exact={exact}
      onClick={handleClicked}
      title={title}
      className={className}
      activeClassName={activeClassName}
      disabled={disabled}
    >
      {children}
    </FluentLink>
  );
}
