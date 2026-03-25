import {
  UsageFeatureProps,
  pickUserEvent,
  UserEvent,
  UsageEventName,
  pickSystemEvent,
  SystemEvent,
} from './UsageTelemetry';

// Generate a new Feature properties
export function getFeature(
  capability: string | string[],
  subCapability: string | string[] | undefined = undefined,
  subCapabilityLevel2: string | string[] | undefined = undefined,
  location: string | undefined = undefined
): UsageFeatureProps {
  return {
    feature: Array.isArray(capability) ? capability.join('.') : capability,
    subFeature: Array.isArray(subCapability) ? subCapability.join('.') : subCapability || '',
    subFeatureLevel2: Array.isArray(subCapabilityLevel2) ? subCapabilityLevel2.join('.') : subCapabilityLevel2 || '',
    featureLocation: location || '',
  };
}

// Use to attach additional subFeatureLevel2 to existing Feature properties
export function mergeFeature(
  existing: UsageFeatureProps,
  subCapabilityLevel2: string | string[] | undefined = undefined,
  location: string | undefined = undefined
): UsageFeatureProps {
  return {
    ...existing,
    subFeatureLevel2: `${existing.subFeatureLevel2 ? `${existing.subFeatureLevel2}.` : ''}${
      Array.isArray(subCapabilityLevel2) ? subCapabilityLevel2.join('.') : subCapabilityLevel2
    }`,
    featureLocation: location || existing.featureLocation,
  };
}

// To be used with <Button />s and <Link />s which expect usageEvent property
export function getClickFeature(
  feature: UsageFeatureProps,
  subCapabilityLevel2: string | string[] | undefined = undefined,
  location: string | undefined = undefined
): { usageEvent: UsageFeatureProps } {
  return {
    usageEvent: mergeFeature(feature, subCapabilityLevel2, location),
  };
}

// To be used with usePageTracking Hook
export function getPageLoadFeature(
  feature: UsageFeatureProps,
  subCapabilityLevel2: string | string[] | undefined = undefined,
  location: string | undefined = undefined
): UserEvent {
  return pickUserEvent({
    eventName: UsageEventName.PageLoad,
    ...mergeFeature(feature, subCapabilityLevel2, location),
  });
}

export function getButtonClickFeature(
  feature: UsageFeatureProps,
  subCapabilityLevel2: string | string[] | undefined = undefined,
  location: string | undefined = undefined
): UserEvent {
  return pickUserEvent({
    eventName: UsageEventName.ButtonClicked,
    ...mergeFeature(feature, subCapabilityLevel2, location),
  });
}

export function getLinkClickFeature(
  feature: UsageFeatureProps,
  subCapabilityLevel2: string | string[] | undefined = undefined,
  location: string | undefined = undefined
): UserEvent {
  return pickUserEvent({
    eventName: UsageEventName.LinkClicked,
    ...mergeFeature(feature, subCapabilityLevel2, location),
  });
}

export function getAPICallFeature(
  feature: UsageFeatureProps,
  subCapabilityLevel2: string | string[] | undefined = undefined,
  location: string | undefined = undefined
): SystemEvent {
  return pickSystemEvent({
    eventName: UsageEventName.BackEndAPICall,
    ...mergeFeature(feature, subCapabilityLevel2, location),
  });
}
