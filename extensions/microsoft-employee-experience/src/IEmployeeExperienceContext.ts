import { IReduxContext } from '@micro-frontend-react/redux/lib/IReduxContext';
import { IAuthClient } from './IAuthClient';
import { IGraphClient } from './IGraphClient';
import { IHttpClient } from './IHttpClient';
import { ITelemetryClient } from './ITelemetryClient';
import { ITelemetryContext } from './ITelemetryContext';
import { IUsageClient } from './IUsageClient';

export interface IEmployeeExperienceContext extends IReduxContext {
  authClient: IAuthClient;
  httpClient: IHttpClient;
  graphClient: IGraphClient;
  usageClient: IUsageClient;
  telemetryClient: ITelemetryClient;
  telemetryContext: ITelemetryContext;
}
