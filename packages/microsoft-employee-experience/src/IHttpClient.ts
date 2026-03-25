import { ICustomProperties } from '@microsoft/applicationinsights-web';
import { AxiosRequestConfig } from 'axios';
import { ITelemetryClient } from './ITelemetryClient';
import { IAuthClient } from './IAuthClient';
import { SystemEvent } from './UsageTelemetry';

export interface IHttpClient {
  request<T>(
    request: IHttpClientRequest,
    options?: IHttpClientRequestOption,
    event?: SystemEvent
  ): Promise<IHttpClientResult<T>>;

  get<T>(
    url: string,
    request?: IHttpClientRequest,
    options?: IHttpClientRequestOption,
    event?: SystemEvent
  ): Promise<IHttpClientResult<T>>;

  post<T>(
    url: string,
    request?: IHttpClientRequest,
    options?: IHttpClientRequestOption,
    event?: SystemEvent
  ): Promise<IHttpClientResult<T>>;

  delete<T>(
    url: string,
    request?: IHttpClientRequest,
    options?: IHttpClientRequestOption,
    event?: SystemEvent
  ): Promise<IHttpClientResult<T>>;

  put<T>(
    url: string,
    request?: IHttpClientRequest,
    options?: IHttpClientRequestOption,
    event?: SystemEvent
  ): Promise<IHttpClientResult<T>>;

  patch<T>(
    url: string,
    request?: IHttpClientRequest,
    options?: IHttpClientRequestOption,
    event?: SystemEvent
  ): Promise<IHttpClientResult<T>>;

  getChildInstance(telemetryClient: ITelemetryClient, authClient: IAuthClient): IHttpClient;
}

export interface IHttpClientOption extends IHttpClientRequestOption {
  logPayload?: boolean;
  correlationIdHeaderName?: string;
}

export interface IHttpHeader {
  [key: string]: string;
}

export interface IHttpClientRequest extends AxiosRequestConfig {
  resource?: string | string[];
  accessToken?: string;
  correlationIdHeaderName?: string;
  header?: IHttpHeader;
}

export interface IHttpClientRequestOption {
  silentError?: boolean;
  customTelemetryProperties?: ICustomProperties;
  disableCorrelationId?: boolean;
}

export interface IHttpClientResult<T> {
  status: number;
  statusText: string;
  data: T;
  headers: IHttpHeader;
}
