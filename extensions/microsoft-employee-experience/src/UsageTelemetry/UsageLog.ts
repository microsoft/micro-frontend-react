import { UsageEvent } from './UsageEvent';
import { UserAttribute } from './UserAttribute';
import { UsageTracker } from './UsageTracker';

export type UsageLog = UsageEvent &
    UserAttribute &
    UsageTracker & { feature: string };
