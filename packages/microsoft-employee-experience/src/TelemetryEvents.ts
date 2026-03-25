// These telemetries were used while back when this library had no support for HEART metrics
// Since then the event names have been replaced with UsageTelemetry event names
// These are provided for backward compatibility if you've been using them in your projects
export enum TelemetryEvents {
  // App
  SessionStarted = 'SessionStarted',

  // User
  UserLogInRequested = 'UserLogInRequested',
  UserLoginFailed = 'UserLoginFailed',
  UserLogOutRequested = 'UserLogOutRequested',
  UserLogOutFailed = 'UserLogOutFailed',
  AcquireTokenFailed = 'AcquireTokenFailed',

  // Routes
  PageEnter = 'PageEnter',
  PageLeave = 'PageLeave',

  // Side nav
  NavLinkClicked = 'NavLinkClicked',

  // Header
  HeaderAppNameLinkClicked = 'HeaderAppNameLinkClicked',
  HeaderSearchRequested = 'HeaderSearchRequested',
  HeaderPanelOpened = 'HeaderPanelOpened',
  HeaderPanelClosed = 'HeaderPanelClosed',

  InvalidComponentConfig = 'InvalidComponentConfig',

  // HTTP
  APIRequestStarted = 'APIRequestStarted',
  APIResponseReceived = 'APIResponseReceived',
  APIFailedWithoutResponse = 'APIFailedWithoutResponse',
  APIFailedResponseReceived = 'APIFailedResponseReceived',

  // Components
  ButtonClicked = 'ButtonClicked',
  LinkClicked = 'LinkClicked',
  FormElementClicked = 'FormElementClicked',
}
