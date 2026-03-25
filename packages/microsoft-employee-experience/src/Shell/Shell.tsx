import * as React from 'react';
import { Context } from '@micro-frontend-react/core/lib/Context';
import { ITelemetryContext } from '../ITelemetryContext';
import { UsageHelper, UserAttribute } from '../UsageTelemetry';
import { ShellStyles } from './Shell.styled';
import { IEmployeeExperienceContext } from '../IEmployeeExperienceContext';

export function Shell(props: React.PropsWithChildren<IEmployeeExperienceContext>): React.ReactElement {
  const { children, ...context } = props;
  const { appName } = context;

  const usageHelper = appName && appName.trim() != '' ? UsageHelper.Fork(appName) : UsageHelper;
  const telemetryContext: ITelemetryContext = {
    sourceComponent: 'Shell',
    sourceScript: 'main',
    setUsageEvent: usageHelper.MassageEvent,
    setUsageUser: (usageUser: UserAttribute) => {
      UsageHelper.SetUser(usageUser);
      usageHelper.SetUser(usageUser);
      return usageUser;
    },
    usageUser: usageHelper.GetUser,
    setUsageConfig: usageHelper.SetUsageConfig,
    getChildContext: usageHelper.ForkTelemetryContext,
  };
  context.telemetryClient?.setContext(telemetryContext);

  return (
    <>
      <ShellStyles />
      <Context.Provider value={{ ...context, telemetryContext }}>{children}</Context.Provider>
    </>
  );
}
