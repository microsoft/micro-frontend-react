import { UsageTelemetryConfig } from './UsageTelemetry';

export interface IUsageClient {
  getUsageUserId(): Promise<string>;

  getUsageConfig(): UsageTelemetryConfig;
}
