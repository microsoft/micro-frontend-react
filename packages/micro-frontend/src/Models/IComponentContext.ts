import { IComponentLoader } from './IComponentLoader';
import { IHttpClient } from './IHttpClient';
import { IAuthClient } from './IAuthClient';
import { ITelemetryClient } from './ITelemetryClient';
import { IGraphClient } from './IGraphClient';
import { ITelemetryContext } from './ITelemetryContext';

export interface IComponentContext {
  id?: string;
  appName?: string;
  componentLoader: IComponentLoader;
  httpClient: IHttpClient;
  authClient: IAuthClient;
  telemetryClient: ITelemetryClient;
  graphClient: IGraphClient;
  telemetryContext?: ITelemetryContext;
}
