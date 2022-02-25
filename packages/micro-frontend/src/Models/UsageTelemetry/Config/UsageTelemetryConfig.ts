export type UsageTelemetryConfig = {
    usageApi: {
        headers: { [key: string]: string };
        url: string;
        method: string;
        resourceId: string;
        cache?: 'localStorage';
    };
    enableUpnLogging: false;
    sessionDurationMinutes: number;
};
