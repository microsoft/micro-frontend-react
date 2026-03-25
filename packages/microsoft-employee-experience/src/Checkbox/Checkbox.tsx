import * as React from 'react';
import { Checkbox as FabricCheckbox } from '@fluentui/react/lib/Checkbox';
import { IEmployeeExperienceContext } from '../IEmployeeExperienceContext';
import { ICheckboxProps } from './Checkbox.types';
import { Context } from '../Context';
import { UserEvent, UsageEventName, EventType } from '../UsageTelemetry';

export function Checkbox(props: ICheckboxProps): React.ReactElement {
  const { onChange, name, usageEvent } = props;
  const { telemetryClient } = React.useContext(Context as React.Context<IEmployeeExperienceContext>);

  const handleChanged = (
    e: React.FormEvent<HTMLElement | HTMLInputElement> | undefined,
    value: boolean | undefined
  ): void => {
    const checkedEvent: UserEvent = {
      eventName: UsageEventName.CheckBoxChanged,
      type: EventType.User,
      businessTransactionId: value?.toString() || 'null',
      ...usageEvent,
    };

    const customProps = props.logCustomProperties?.() || {};
    telemetryClient.trackEvent(checkedEvent, customProps);

    onChange(name, value as boolean);
  };

  return <FabricCheckbox {...props} onChange={handleChanged} />;
}
