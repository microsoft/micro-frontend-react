import * as React from 'react';
import { Dropdown as FabricDropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { IEmployeeExperienceContext } from '../IEmployeeExperienceContext';
import { IDropdownProps } from './Dropdown.types';
import { Context } from '../Context';
import { UserEvent, UsageEventName, EventType } from '../UsageTelemetry';

export function Dropdown(props: IDropdownProps): React.ReactElement {
  const { onChange, name, label, onFocus, usageEvent } = props;
  const { telemetryClient, telemetryContext } = React.useContext(Context as React.Context<IEmployeeExperienceContext>);

  const handleChanged = (e: React.FormEvent<HTMLDivElement>, option: IDropdownOption | undefined): void => {
    const dropDownEvent: UserEvent = {
      eventName: UsageEventName.DropdownSelected,
      type: EventType.User,
      businessTransactionId: option?.key.toString(),
      ...usageEvent,
    };
    telemetryClient.trackEvent(dropDownEvent, {
      ...telemetryContext,
      type: 'Dropdown',
      label,
      name,
      key: option?.key.toString(),
      ...(props.logCustomProperties?.() || {}),
    });
    if (option) onChange(name, option.key);
  };

  const handleFocused = (e: React.FocusEvent<HTMLDivElement>): void => {
    const dropDownEvent: UserEvent = {
      eventName: UsageEventName.DropdownFocused,
      type: EventType.User,
      ...usageEvent,
    };
    telemetryClient.trackEvent(dropDownEvent, {
      ...telemetryContext,
      type: 'Dropdown',
      label,
      name,
      ...(props.logCustomProperties?.() || {}),
    });

    onFocus && onFocus(e);
  };

  return <FabricDropdown {...props} onChange={handleChanged} onFocus={handleFocused} />;
}
