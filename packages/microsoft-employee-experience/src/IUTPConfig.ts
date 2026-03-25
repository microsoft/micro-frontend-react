export interface IUTPConfig {
  UTPConfig?: {
    EnvironmentName: string;
    ServiceOffering: string;
    ServiceLine: string;
    Service: string;
    ComponentName: string;
    ComponentId: string;
    [key: string]: string;
  };
}
