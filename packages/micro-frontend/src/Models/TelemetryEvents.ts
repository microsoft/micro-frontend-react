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
    LinkClicked = 'LinkCliked',
    FormElementClicked = 'FormElementClicked',
}
