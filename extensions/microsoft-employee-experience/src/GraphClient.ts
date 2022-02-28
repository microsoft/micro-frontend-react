import { IGraphClient, GraphPhotoSize, IGraphClientOptions } from './IGraphClient';
import { IHttpClient } from './IHttpClient';

export class GraphClient implements IGraphClient {
  private readonly httpClient: IHttpClient;
  private readonly graphBaseUrl: string;
  private readonly graphResourceUri: string;

  public constructor(httpClient: IHttpClient, options?: IGraphClientOptions) {
    this.httpClient = httpClient;

    this.graphBaseUrl = options?.baseUrl ?? 'https://graph.microsoft.com/v1.0';
    this.graphResourceUri = options?.resourceUri ?? 'https://graph.microsoft.com';
  }

  public async getPhoto(upn: string, size: GraphPhotoSize = undefined): Promise<string | null> {
    return new Promise(async (resolve, reject): Promise<void> => {
      try {
        let url = `${this.graphBaseUrl}/users/${upn}`;
        url = `${url}/${size ? `photos/${size}x${size}/$value` : 'photo/$value'}`;

        const { data } = await this.httpClient.request<Blob>(
          {
            url,
            resource: this.graphResourceUri,
            responseType: 'blob',
          },
          { silentError: true }
        );

        const reader = new FileReader();
        reader.onload = (): void => {
          if (reader.result) {
            resolve(reader.result.toString());
          } else {
            reject();
          }
        };
        reader.readAsDataURL(data);
      } catch {
        resolve(null);
      }
    });
  }
}
