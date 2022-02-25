import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { withStore } from '../../Components/withStore';
import { Shell } from '../../Components/Shell';
import {
    ComponentLoader,
    GraphClient,
    HttpClient,
    ReducerRegistry,
    StoreBuilder,
    TelemetryClient,
} from '../../Services';
import { guid } from '../../Utils/Guid';
import { BuildOnceAuthClient } from './BuildOnceAuthClient';
import { IConfiguration } from '@microsoft/myhub_webauth_sdk/dist/IConfiguration';

export type BuildOnceAppOptions = IConfiguration & {
    appName?: string;
    enableReduxLogger?: boolean;
    testAccessToken?: string;
};

export function OnBuildOnce(Component: React.ComponentType, options: BuildOnceAppOptions) {
    const telemetryClient = new TelemetryClient({
        instrumentationKey: '958d6073-76a5-443a-9901-9ec4c35c030e', // options.aiKey,
        UTPConfig: {
            EnvironmentName: 'Non-Production',
            ServiceOffering: 'Example Service Offering',
            ServiceLine: 'Example Service Line',
            Service: 'Example Service',
            ComponentName: 'Example Component',
            ComponentId: 'Example Id',
        },
        defaultProperties: {
            appName: options.appName || Component.displayName,
        },
    });
    const authClient = new BuildOnceAuthClient(options);
    const httpClient = new HttpClient(telemetryClient, authClient);
    const graphClient = new GraphClient(httpClient);
    const componentLoader = new ComponentLoader(telemetryClient, httpClient);
    const reducerRegistry = new ReducerRegistry();
    const appName = 'DemoApp';
    const storeResult = new StoreBuilder(reducerRegistry, {})
        .configureLogger(options.enableReduxLogger === true)
        .configureSaga({ telemetryClient, authClient, httpClient, componentLoader, graphClient, appName })
        .configurePersistor({
            key: Component.displayName || guid(),
        })
        .build();

    const ShellWithStore = withStore(storeResult)(Shell);

    render(
        <ShellWithStore>
            <BrowserRouter>
                <Component />
            </BrowserRouter>
        </ShellWithStore>,
        document.getElementById('app')
    );
}
