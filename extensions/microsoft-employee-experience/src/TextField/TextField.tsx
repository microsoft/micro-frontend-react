import * as React from 'react';
import { TextField as FabricTextField } from '@fluentui/react/lib/TextField';
import { IEmployeeExperienceContext } from '../IEmployeeExperienceContext';
import { ITextFieldProps } from './TextField.types';
import { Context } from '../Context';
import { UserEvent, UsageEventName, EventType } from '../UsageTelemetry';

export function TextField(props: ITextFieldProps): React.ReactElement {
  const { onChange, name, label, onFocus, usageEvent } = props;
  const { telemetryClient, telemetryContext } = React.useContext(Context as React.Context<IEmployeeExperienceContext>);

  const handleChanged = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    value: string | undefined
  ): void => {
    const textEvent: UserEvent = {
      eventName: UsageEventName.TextChanged,
      type: EventType.User,
      businessTransactionId: value || 'null',
      ...usageEvent,
    };
    const customProps = props.logCustomProperties?.() || {};
    telemetryClient.trackEvent(textEvent, customProps); //TODO: Review with Won => Too many change events. Sould use with debounce

    onChange(name, value as string);
  };

  const handleFocused = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const textEvent: UserEvent = {
      eventName: UsageEventName.TextboxFocused,
      type: EventType.User,
      ...usageEvent,
    };
    telemetryClient.trackEvent(textEvent, {
      ...telemetryContext,
      type: 'TextField',
      label,
      name,
      ...(props.logCustomProperties?.() || {}),
    });

    onFocus && onFocus(e);
  };

  return <FabricTextField {...props} onChange={handleChanged} onFocus={handleFocused} />;
}
