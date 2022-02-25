import * as React from 'react';
import { ShellProps, ITelemetryContext, UsageHelper, UserAttribute } from '../../Models';
import { ComponentContext } from '../../Contexts/ComponentContext';
import { ShellStyles } from './Shell.styled';

export function Shell(props: ShellProps): React.ReactElement {
    const { children, appName, ...context } = props;
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
            <ComponentContext.Provider value={{ ...context, telemetryContext }}>{children}</ComponentContext.Provider>
        </>
    );
}
