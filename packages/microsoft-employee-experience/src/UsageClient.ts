import { IHttpClient } from './IHttpClient';
import { IUsageClient } from './IUsageClient';
import { UsageTelemetryConfig } from './UsageTelemetry';

export class UsageClient implements IUsageClient {
  private readonly usageTelemetryConfig: UsageTelemetryConfig;
  private readonly httpClient: IHttpClient;

  private readonly localStorageKey = '__Core.UserAttribute.UsageUserId__';
  private readonly sesionDurationConfig = '__Core.UserAttribute.sessionDurationConfig__';

  public constructor(httpClient: IHttpClient, usageTelemetryConfig: UsageTelemetryConfig) {
    this.usageTelemetryConfig = usageTelemetryConfig;
    this.httpClient = httpClient;
  }

  public getUsageConfig = (): UsageTelemetryConfig => this.usageTelemetryConfig;

  public async getUsageUserId(): Promise<string> {
    return new Promise(async (resolve, reject): Promise<void> => {
      try {
        let usageUserId: string | null = '';

        if (this.usageTelemetryConfig.usageApi.cache === 'localStorage') {
          usageUserId = localStorage.getItem(this.localStorageKey);
          localStorage.setItem(this.sesionDurationConfig, this.usageTelemetryConfig.sessionDurationMinutes.toString());
        }
        const invalidUserIds = ['', 'NOTFOUND', 'NOTUPNFOUND', 'ERROR', 'UNDEFINED', 'UNINITIALIZED'];
        if (usageUserId && invalidUserIds.indexOf(usageUserId.trim().toUpperCase()) < 0) {
          resolve(usageUserId);
        } else {
          const { data: content } = await this.httpClient.request<{
            UsageUserId: string;
          }>(
            {
              url: this.usageTelemetryConfig.usageApi.url,
              resource: this.usageTelemetryConfig.usageApi.resourceId,
              header: this.usageTelemetryConfig.usageApi.headers,
            },
            { silentError: true }
          );
          if (content && content.UsageUserId) {
            if (this.usageTelemetryConfig.usageApi.cache === 'localStorage') {
              localStorage.setItem(this.localStorageKey, content.UsageUserId);
            }
            resolve(content.UsageUserId);
          } else {
            reject();
          }
        }
      } catch {
        reject();
      }
    });
  }
}
