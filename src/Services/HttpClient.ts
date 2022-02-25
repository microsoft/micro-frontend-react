import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { guid } from '../Utils/Guid';
import {
    IHttpClient,
    ITelemetryClient,
    IHttpClientOption,
    IHttpClientRequest,
    IHttpClientRequestOption,
    IAuthClient,
    IHttpClientResult,
    CustomProperties,
    IHttpHeader,
    SystemEvent,
    EventType,
    TelemetryEvents,
} from '../Models';

export class HttpClient implements IHttpClient {
    private readonly telemetryClient: ITelemetryClient;
    private readonly authClient: IAuthClient | null;
    private readonly options: IHttpClientOption = {
        logPayload: false,
        correlationIdHeaderName: 'x-correlation-id',
        disableCorrelationId: false,
    };

    public constructor(
        telemetryClient: ITelemetryClient,
        authClient: IAuthClient | null = null,
        options: IHttpClientOption | null = null
    ) {
        this.telemetryClient = telemetryClient;
        this.authClient = authClient;

        this.options = Object.assign({}, this.options, options);
    }

    public async request<T>(
        request: IHttpClientRequest,
        options?: IHttpClientRequestOption,
        event?: SystemEvent
    ): Promise<IHttpClientResult<T>> {
        return new Promise(async (resolve, reject): Promise<void> => {
            const correlationId = this.telemetryClient.getCorrelationId();
            const correlationHeader: CustomProperties = {};
            if (!this.options.disableCorrelationId && !options?.disableCorrelationId) {
                correlationHeader[
                    request.correlationIdHeaderName || this.options.correlationIdHeaderName || 'CorrelationId'
                ] = correlationId;
            }

            const customTelemetryProperty = options?.customTelemetryProperties ?? {};

            const requestTelemetryProperties = {
                method: request.method || 'get',
                url: request.url,
                requestId: guid(),
                resource: request.resource,
                ...customTelemetryProperty,
            };
            const requestOptions: AxiosRequestConfig = {
                ...request,
                method: request.method || 'get',
                headers: Object.assign(
                    {
                        'Content-Type': 'application/json',
                    },
                    correlationHeader,
                    request.headers,
                    request.header
                ),
            };

            try {
                let token: string | undefined | null = request.accessToken;
                if (!request.accessToken && request.resource && this.authClient) {
                    token = await this.authClient.acquireToken(request.resource);
                }
                if (token) {
                    requestOptions.headers = Object.assign({}, requestOptions.headers, {
                        Authorization: `Bearer ${token}`,
                    });
                }
            } catch (ex) {
                reject({
                    status: -1,
                    statusText: TelemetryEvents.AcquireTokenFailed,
                    data: ex,
                });
            }
            const startTime = new Date();
            try {
                this.telemetryClient.trackTrace({
                    message: TelemetryEvents.APIRequestStarted,
                    properties: {
                        ...requestTelemetryProperties,
                        ...this.getPayloadTelemetryProperty(this.options.logPayload, request.data),
                    },
                });

                const response = await axios.request(requestOptions);
                const endTime = new Date();
                const elapsed = endTime.getTime() - startTime.getTime();
                const responseTelemetryProperties = {
                    ...requestTelemetryProperties,
                    status: response.status,
                    statusText: response.statusText,
                    elapsed,
                };

                this.telemetryClient.trackTrace({
                    message: TelemetryEvents.APIResponseReceived,
                    properties: {
                        ...responseTelemetryProperties,
                        ...this.getPayloadTelemetryProperty(this.options.logPayload, response.data),
                    },
                });
                const usageEvent: SystemEvent = {
                    ...event,
                    type: EventType.System,
                    timeTaken: elapsed,
                    experienceResult: true,
                    // Do not log the response data.
                    businessTransactionId: JSON.stringify({
                        status: response.status,
                        correlationId,
                        ...requestTelemetryProperties,
                    }),
                };
                this.telemetryClient.trackEvent(usageEvent);

                resolve({
                    status: response.status,
                    statusText: response.statusText,
                    data: response.data,
                    headers: response.headers as IHttpHeader,
                });
            } catch (e) {
                const ex = e as AxiosError;

                if (ex.response) {
                    const errorTelemetryProperty = {
                        ...requestTelemetryProperties,
                        status: ex.response.status,
                        statusText: ex.response.statusText,
                        error: ex.response.data,
                    };

                    this.telemetryClient.trackTrace({
                        message: TelemetryEvents.APIFailedResponseReceived,
                        properties: errorTelemetryProperty,
                    });
                    const usageEvent: SystemEvent = {
                        ...event,
                        type: EventType.System,
                        timeTaken: +new Date() - +startTime,
                        experienceResult: false,
                        businessTransactionId: JSON.stringify({
                            status: ex.response.status,
                            correlationId,
                            ...requestTelemetryProperties,
                        }),
                    };
                    this.telemetryClient.trackEvent(usageEvent);

                    if (!options || !options.silentError) {
                        this.telemetryClient.trackException({
                            exception: new Error(ex.response.statusText),
                            properties: errorTelemetryProperty,
                        });
                    }

                    reject({
                        status: ex.response.status,
                        statusText: ex.response.statusText,
                        data: ex.response.data,
                    });
                } else {
                    this.telemetryClient.trackTrace({
                        message: TelemetryEvents.APIFailedWithoutResponse,
                        properties: requestTelemetryProperties,
                    });
                    const usageEvent: SystemEvent = {
                        ...event,
                        type: EventType.System,
                        timeTaken: +new Date() - +startTime,
                        experienceResult: false,
                        //Do not log the response data.
                        businessTransactionId: JSON.stringify({
                            status: 'Unknown',
                            correlationId,
                            ...requestTelemetryProperties,
                        }),
                    };
                    this.telemetryClient.trackEvent(usageEvent);
                    this.telemetryClient.trackException({
                        exception: ex,
                        properties: requestTelemetryProperties,
                    });

                    reject({
                        status: -1,
                        statusText: TelemetryEvents.APIFailedWithoutResponse,
                        data: ex,
                    });
                }
            }
        });
    }

    public get<T>(
        url: string,
        request?: IHttpClientRequest,
        option?: IHttpClientRequestOption,
        event?: SystemEvent
    ): Promise<IHttpClientResult<T>> {
        return this.request(Object.assign({}, request, { url, method: 'get' }), option, event);
    }

    public post<T>(
        url: string,
        request?: IHttpClientRequest,
        option?: IHttpClientRequestOption,
        event?: SystemEvent
    ): Promise<IHttpClientResult<T>> {
        return this.request(Object.assign({}, request, { url, method: 'post' }), option, event);
    }

    public delete<T>(
        url: string,
        request?: IHttpClientRequest,
        option?: IHttpClientRequestOption,
        event?: SystemEvent
    ): Promise<IHttpClientResult<T>> {
        return this.request(Object.assign({}, request, { url, method: 'delete' }), option, event);
    }

    public put<T>(
        url: string,
        request?: IHttpClientRequest,
        option?: IHttpClientRequestOption,
        event?: SystemEvent
    ): Promise<IHttpClientResult<T>> {
        return this.request(Object.assign({}, request, { url, method: 'put' }), option, event);
    }

    public patch<T>(
        url: string,
        request?: IHttpClientRequest,
        option?: IHttpClientRequestOption,
        event?: SystemEvent
    ): Promise<IHttpClientResult<T>> {
        return this.request(Object.assign({}, request, { url, method: 'patch' }), option, event);
    }

    public getChildInstance = (telemetryClient: ITelemetryClient, authClient: IAuthClient): IHttpClient => {
        return new HttpClient(telemetryClient, authClient, this.options);
    };

    private getPayloadTelemetryProperty(shouldLogPayload = false, payload: CustomProperties): CustomProperties {
        return shouldLogPayload ? { payload } : {};
    }
}
