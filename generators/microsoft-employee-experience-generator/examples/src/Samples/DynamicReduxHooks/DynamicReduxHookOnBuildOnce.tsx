import { OnBuildOnce } from '@micro-frontend-react/employee-experience/lib/OnBuildOnce';
import { TelemetryClient } from '@micro-frontend-react/employee-experience/lib/TelemetryClient';
import { BuildOnceAuthClient } from '../BuildOnceAuthClient';
import { DynamicReduxHooks } from './DynamicReduxHooks';

// Telemetry client to be replaced with MyHub SDK when avail
const telemetryClient = new TelemetryClient({
  instrumentationKey: __INSTRUMENTATION_KEY__,
  UTPConfig: {
    EnvironmentName: 'Non-Production',
    ServiceOffering: 'Example Service Offering',
    ServiceLine: 'Example Service Line',
    Service: 'Example Service',
    ComponentName: 'Example Component',
    ComponentId: 'Example Id',
  },
  defaultProperties: {
    appName: __APP_NAME__,
  },
});

const authClient = new BuildOnceAuthClient({
  auth: {
    MYHUB_APIM_SUBSCRIPTION_KEY: '',
    MYHUB_APIM_URL: '',
    RESOURCE_ID: '',
  },
  // Copy over access token from MyHub APIM to test in non-MyHub and non-Teams environments
  testAccessToken: '',
});

OnBuildOnce(DynamicReduxHooks, {
  appName: 'BuildOnceTest',
  isProduction: !__IS_DEVELOPMENT__,
  telemetryClient,
  authClient,
});
