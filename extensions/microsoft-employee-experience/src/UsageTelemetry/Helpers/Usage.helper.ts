import { UsageLog } from '../UsageLog';
import { UserAttribute, pickUserAttribute } from '../UserAttribute';
import { EventType, UsageEvent } from '../UsageEvent';
import {
    pickAwareEvent,
    pickUserEvent,
    pickUsageTracker,
    pickSystemEvent,
    UserEvent,
    SystemEvent,
} from '..';
import { UsageTracker } from '../UsageTracker';
import { UsageTelemetryConfig } from '../Config/UsageTelemetryConfig';
import { ITelemetryContext } from '../../ITelemetryContext';

type UsageLogHash = { [feature: string]: UsageLog };

class UsageHelperImpl {
    private usageUser: UserAttribute = {} as UserAttribute;
    private feature = '';
    private latestEvents: UsageLogHash = {} as UsageLogHash;
    private lastActiveTimeKey = '__Core.UserAttribute.lastActiveTime__';
    private sessionKey = '__Core.UserAttribute.sessionId__';
    private userIdKey = '__Core.UserAttribute.UsageUserId__';
    private usageConfig: UsageTelemetryConfig | undefined;

    constructor(feature: string) {
        this.feature = feature;
    }
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    public Fork = (feature: string): typeof UsageHelper => {
        const newUsageHelper = new UsageHelperImpl(feature);
        // Fix for micro-fe not aligning to the previous page-tracking from parent
        newUsageHelper.latestEvents = { ...this.latestEvents };
        newUsageHelper.SetUserRef(this.usageUser);
        if (this.usageConfig) newUsageHelper.SetUsageConfig(this.usageConfig);
        return newUsageHelper;
    };

    public ForkTelemetryContext = (
        feature: string,
        source: string
    ): ITelemetryContext => {
        const newUsageHelper = new UsageHelperImpl(feature);
        // Fix for micro-fe not aligning to the previous page-tracking from parent
        newUsageHelper.latestEvents = { ...this.latestEvents };
        newUsageHelper.SetUserRef(this.usageUser);
        if (this.usageConfig) newUsageHelper.SetUsageConfig(this.usageConfig);
        const newContext: ITelemetryContext = {
            sourceComponent: feature,
            sourceScript: source,
            setUsageEvent: newUsageHelper.MassageEvent,
            setUsageUser: (usageUser: UserAttribute) => {
                UsageHelper.SetUser(usageUser);
                return usageUser;
            },
            usageUser: newUsageHelper.GetUser,
            setUsageConfig: newUsageHelper.SetUsageConfig,
            getChildContext: newUsageHelper.ForkTelemetryContext,
        };
        return newContext;
    };

    private SetUserRef = (userAttribute: UserAttribute): void => {
        //Do not spread or clone the user attribute. The forked helpers point to the same reference.
        this.usageUser = userAttribute;
        this.checkSession();
    };

    public SetUser = (userAttribute: UserAttribute): void => {
        //Do not spread or clone the user attribute. The forked helpers point to the same reference.
        this.usageUser.lastActiveTime = userAttribute.lastActiveTime;
        this.usageUser.sessionId = userAttribute.sessionId;
        this.usageUser.usageUserId = userAttribute.usageUserId;
        if (this.usageUser.usageUserId === 'Error')
            this.usageUser.usageUserId =
                localStorage.getItem(this.userIdKey) ?? 'Error';
        this.checkSession();
    };

    public SetUsageConfig = (config: UsageTelemetryConfig): void => {
        this.usageConfig = config;
        this.checkSession();
    };

    public GetUser = (): UserAttribute => {
        return { ...this.usageUser };
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private parseName = (e: any): { [key: string]: string } => {
        const value = `${e.feature || this.feature}-${
            e.subFeature || '$inherited$'
        }-${e.type}-${e.eventName || '$inherited$'}`;
        const featureKey = e.feature || this.feature;
        const subFeatureKey = e.subFeature
            ? featureKey + '-' + e.subFeature
            : '';
        const eventNameKey = e.eventName
            ? featureKey + '-' + (e.subFeature || 'NA') + '-' + e.eventName
            : '';
        return {
            key: eventNameKey || subFeatureKey || featureKey,
            value,
            featureKey,
            subFeatureKey,
            eventNameKey,
        };
    };

    private getLatestEvent = (e: unknown): UsageLog => {
        const { key, subFeatureKey, featureKey, eventNameKey } = this.parseName(
            e
        );
        //Page load key
        if ((e as UserEvent).eventName == 'PageLoad') {
            return {
                ...this.latestEvents[key.replace('PageLoad', 'PageLoadStart')],
            };
        }
        // Climb the hierarchy to fetch key
        const past = new Date('0001-01-01T00:00:00Z');
        const closestMatchKey = Object.keys(this.latestEvents)
            .filter((a) => a.startsWith(key + '-'))
            .reduce((prev: string, curr: string): string => {
                const previous = this.latestEvents[prev]?.eventDate || past;
                const current = this.latestEvents[curr]?.eventDate || past;
                return current > previous ? curr : prev;
            }, '');
        const caseIgnorantFeature =
            Object.keys(this.latestEvents).find(
                (key) => key.toLowerCase() === featureKey.toLowerCase()
            ) || '';
        const latest: UsageLog =
            this.latestEvents[key] || // If there is a head-on match to key
            this.latestEvents[eventNameKey] || // If there is a closest event based key
            this.latestEvents[subFeatureKey] || // If there is a closest subfeature based key
            this.latestEvents[featureKey] || // If there is a closest feature based key
            this.latestEvents[closestMatchKey] || // IF there is a closes match by hierarchy travel
            this.latestEvents[this.feature] || // If there is no match at all, then send the latest helper event
            this.latestEvents[caseIgnorantFeature]; // Fallback to feature name searched by case-insensitive search
        return { ...latest };
    };

    public MassageEvent = (event: UsageEvent): UsageEvent => {
        const eventCopy: UsageEvent = { ...event };
        const name = this.parseName(event);
        this.checkSession();
        if (!eventCopy.type) return eventCopy;
        let usageLog: UsageLog = {} as UsageLog; // Let's prepare the usageLog one step at a time.
        usageLog.name = name.value;
        usageLog.eventDate = (event as UsageTracker).eventDate || new Date();
        switch (eventCopy.type) {
            case EventType.Aware:
                const awareEvent = { ...pickAwareEvent(eventCopy) } as UsageLog;
                this.latestEvents[EventType.Aware] = awareEvent;
                this.usageUser = pickUserAttribute({
                    ...this.usageUser,
                    ...awareEvent,
                });
                if ('sessionId' in eventCopy)
                    this.usageUser.sessionId = (eventCopy as UserAttribute).sessionId; //Retain the input session-id
                usageLog = awareEvent;
                break;
            case EventType.User:
                //Lets build a new UsageLog from the user's event
                const latestEvent = this.getLatestEvent(eventCopy);
                const currentFeature =
                    eventCopy.feature || latestEvent?.feature || this.feature; // Deduce current feature
                usageLog = {
                    ...usageLog,
                    ...pickUserAttribute(this.usageUser || eventCopy),
                } as UsageLog; // Start with User Attributes
                usageLog = {
                    ...usageLog,
                    ...pickUserEvent(eventCopy),
                    feature: currentFeature,
                } as UsageLog;
                if (eventCopy.eventName === 'PageLoadStart') {
                    usageLog.pageTrackingId = this.Guid();
                    usageLog.startTime = new Date();
                } else if (eventCopy.eventName === 'PageLoad') {
                    // TODO: ras1 => remove hard-coding
                    usageLog.pageTrackingId = latestEvent?.startTime
                        ? latestEvent.pageTrackingId
                        : this.Guid();
                    usageLog.timeTaken = eventCopy.timeTaken
                        ? eventCopy.timeTaken
                        : +new Date() - +(latestEvent?.startTime || new Date());
                } else {
                    const latestUserEvent = this.getLatestEvent(eventCopy);
                    if (latestUserEvent) {
                        const tracker = {
                            ...pickUsageTracker(latestUserEvent),
                        };
                        usageLog.pageTrackingId = tracker.pageTrackingId;
                    }
                }
                usageLog.actionTrackingId = this.Guid(); //Attach a uniqueGuid for the action.
                const newKey = this.parseName({
                    ...eventCopy,
                    feature: currentFeature,
                });
                this.latestEvents[newKey.key] = usageLog;
                this.latestEvents[this.feature] = usageLog; // Store a copy of the latest event to the shell object
                break;
            case EventType.System:
                const latestUserEvent: UsageLog = this.getLatestEvent(
                    eventCopy
                );
                //Lets build a new UsageLog from the system event
                usageLog = {
                    ...usageLog,
                    ...pickUserAttribute(
                        (this.usageUser || eventCopy) as UserAttribute
                    ),
                    ...pickSystemEvent(eventCopy as SystemEvent),
                } as UsageLog;
                //TODO: How to handle a new page load event ?
                // if (!this.getLatestEvent(eventCopy)) {
                //}
                const userEvent = pickUserEvent(latestUserEvent as UserEvent);
                const tracker = pickUsageTracker(
                    latestUserEvent as UsageTracker
                );
                usageLog.pageTrackingId = tracker.pageTrackingId;
                usageLog.correlationTrackingId = tracker.actionTrackingId;
                if (!(usageLog as SystemEvent).feature) {
                    (usageLog as SystemEvent).feature =
                        userEvent.feature || 'NA'; //TODO: Test case input shouldnt be modified
                }
                if (!(usageLog as SystemEvent).subFeature) {
                    (usageLog as SystemEvent).subFeature =
                        userEvent.subFeature || 'NA'; //TODO: Test case input shouldnt be modified
                }
                if (!(usageLog as SystemEvent).eventName) {
                    (usageLog as SystemEvent).eventName = userEvent.eventName;
                }
                break;
        }
        const newKey = this.parseName(usageLog);
        usageLog.name = newKey.value;
        usageLog.inheritedName = name.value;
        /* istanbul ignore next */
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            this.consoleUsageLog(newKey.value, usageLog);
        }
        if ('sessionId' in eventCopy)
            usageLog.sessionId = (eventCopy as UserAttribute).sessionId; //Retain the input session-id
        usageLog.usageVersion =
            (eventCopy as UsageTracker)?.usageVersion || '1.0';
        return usageLog;
    };
    /* istanbul ignore next */
    private consoleUsageLog(
        name: string,
        usageLogData: Partial<UsageEvent>
    ): void {
        const userEventStyle = 'color: #FFA500; padding: 2px 5px;';
        const systemEventStyle = 'color: #c46210; padding: 2px 5px';
        const boldFont = 'font-weight: bold;';
        const eventStyle =
            usageLogData.type === EventType.User
                ? userEventStyle
                : systemEventStyle;
        console.group('%cusage event %c %s', eventStyle, boldFont, name);
        console.dir(usageLogData);
        console.groupEnd();
    }
    private checkSession(): void {
        //Do not manage session until usageConfig is materialized
        if (this.usageConfig) {
            const lastActive = new Date(
                localStorage.getItem(this.lastActiveTimeKey) || new Date()
            );
            const sessionId = localStorage.getItem(this.sessionKey);
            const duration = this.diffInMinutes(lastActive, new Date());
            if (
                duration < (this.usageConfig?.sessionDurationMinutes || -1) &&
                sessionId
            ) {
                this.usageUser.sessionId = sessionId;
            } else {
                this.usageUser.sessionId = this.Guid();
                localStorage.setItem(this.sessionKey, this.usageUser.sessionId);
            }
            localStorage.setItem(this.lastActiveTimeKey, new Date().toString());
        }
    }

    public Guid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
            /[xy]/g,
            (c: string): string => {
                const r = (Math.random() * 16) | 0,
                    v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            }
        );
    }
    private diffInMinutes = (date1: Date, date2: Date): number => {
        let diff = (date1.getTime() - date2.getTime()) / 1000;
        diff /= 60;
        return Math.abs(Math.round(diff));
    };
}

export const UsageHelper = new UsageHelperImpl('Shell');
