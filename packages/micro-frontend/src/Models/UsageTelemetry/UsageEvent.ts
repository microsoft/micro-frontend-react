import { UserEvent } from './UsageEvent/UserEvent';
import { SystemEvent } from './UsageEvent/SytemEvent';
import { AwareEvent } from './UsageEvent/AwareEvent';

export type UsageEvent = UserEvent | SystemEvent | AwareEvent;

export enum EventType {
    User = 'UserAction',
    System = 'SystemAction',
    Aware = 'AwareAction',
}
