import { IGraphClient, IHttpClient, GraphPhotoSize } from '../../Models';
import { GraphClientOptions } from './GraphClient.types';

export class GraphClient implements IGraphClient {
    private readonly httpClient: IHttpClient;
    private readonly graphBaseUrl: string = 'https://graph.microsoft.com/v1.0';
    private readonly graphResourceUri: string = 'https://graph.microsoft.com';

    public constructor(httpClient: IHttpClient, graphClientOptions: GraphClientOptions | undefined = undefined) {
        this.httpClient = httpClient;

        if (graphClientOptions) {
            this.graphBaseUrl = graphClientOptions.baseUrl;
            this.graphResourceUri = graphClientOptions.resourceUri;
        }
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
