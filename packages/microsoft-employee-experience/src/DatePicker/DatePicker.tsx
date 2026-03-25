import * as React from 'react';
import { DatePicker as FabricDatePicker } from '@fluentui/react/lib/DatePicker';
import { IEmployeeExperienceContext } from '../IEmployeeExperienceContext';
import { IDatePickerProps } from './DatePicker.types';
import { Context } from '../Context';
import { UserEvent, UsageEventName, EventType } from '../UsageTelemetry';

export function DatePicker(props: IDatePickerProps): React.ReactElement {
  const { onChange, name, label, onClick, usageEvent } = props;
  const { telemetryClient, telemetryContext } = React.useContext(Context as React.Context<IEmployeeExperienceContext>);

  const handleDateSelected = (date: Date | null | undefined): void => {
    const datePickerEvent: UserEvent = {
      eventName: UsageEventName.DatePickerDateSelected,
      type: EventType.User,
      businessTransactionId: date?.toDateString() || 'null',
      ...usageEvent,
    };
    const customProps = props.logCustomProperties?.() || {};
    telemetryClient.trackEvent(datePickerEvent, customProps);
    onChange(name, date || null);
  };

  const handleClicked = (e: React.MouseEvent<HTMLElement | HTMLInputElement, MouseEvent>): void => {
    const datePickerEvent: UserEvent = {
      eventName: UsageEventName.DatePickerClicked,
      type: EventType.User,
      ...usageEvent,
    };
    telemetryClient.trackEvent(datePickerEvent, {
      ...telemetryContext,
      type: 'DatePicker',
      label,
      name,
      ...(props.logCustomProperties?.() || {}),
    });

    onClick && onClick(e);
  };

  return <FabricDatePicker {...props} onChange={undefined} onSelectDate={handleDateSelected} onClick={handleClicked} />;
}
