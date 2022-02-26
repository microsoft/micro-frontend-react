import {
  IAuthClient,
  IHttpClient,
  IHttpClientRequest,
  IHttpClientRequestOption,
  IHttpClientResult,
  ITelemetryClient,
} from '@microsoft/micro-frontend/lib/Models';

export class DummyHttpClient implements IHttpClient {
  async get<T>(
    url: string,
    request?: IHttpClientRequest,
    options?: IHttpClientRequestOption
  ): Promise<IHttpClientResult<T>> {
    const response = await fetch(request.url);

    return {
      status: response.status,
      statusText: response.statusText,
      data: await response.json(),
      headers: response.headers,
    };
  }

  getChildInstance(telemetryClient: ITelemetryClient, authClient: IAuthClient): IHttpClient {
    throw new Error('Not implemented');
  }

  patch<T>(
    url: string,
    request?: IHttpClientRequest,
    options?: IHttpClientRequestOption
  ): Promise<IHttpClientResult<T>> {
    throw new Error('Not implemented');
  }

  post<T>(
    url: string,
    request?: IHttpClientRequest,
    options?: IHttpClientRequestOption
  ): Promise<IHttpClientResult<T>> {
    throw new Error('Not implemented');
  }

  put<T>(url: string, request?: IHttpClientRequest, options?: IHttpClientRequestOption): Promise<IHttpClientResult<T>> {
    throw new Error('Not implemented');
  }

  request<T>(request: IHttpClientRequest, options?: IHttpClientRequestOption): Promise<IHttpClientResult<T>> {
    throw new Error('Not implemented');
  }

  delete<T>(
    url: string,
    request?: IHttpClientRequest,
    options?: IHttpClientRequestOption
  ): Promise<IHttpClientResult<T>> {
    throw new Error('Not implemented');
  }
}
