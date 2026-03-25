import * as React from 'react';
import { HeaderRoot } from './Header.styled';
import { CoherenceHeader } from '@coherence-design-system/controls/lib/header/CoherenceHeader';
import {
  SearchSettings,
  ICoherenceHeaderProps,
  FarRightNotificationPanelProps,
  FarRightSettingsPanelProps,
  FarRightFeedbackPanelProps,
  FarRightProfilePanelProps,
} from '@coherence-design-system/controls/lib/header/CoherenceHeader.types';
import { useUser } from '@micro-frontend-react/employee-experience/lib/useUser';
import { useGraphPhoto } from '@micro-frontend-react/employee-experience/lib/useGraphPhoto';
import { Context } from '@micro-frontend-react/employee-experience/lib/Context';
import { IEmployeeExperienceContext } from '@micro-frontend-react/employee-experience/lib/IEmployeeExperienceContext';
import { UserEvent, EventType, UsageEventName } from '@micro-frontend-react/employee-experience/lib/UsageTelemetry';
import { HeaderPanel } from './Header.types';

export function Header(props: ICoherenceHeaderProps): React.ReactElement {
  const { farRightSettings, searchSettings, ...otherProps } = props;
  const { telemetryClient, authClient } = React.useContext(Context as React.Context<IEmployeeExperienceContext>);
  const user = useUser();
  const photo = useGraphPhoto();

  const searchConfig: SearchSettings | undefined = searchSettings;
  if (searchConfig) {
    const originalOnSearch = searchConfig.onSearch;
    searchConfig.onSearch = (searchTerm: string): void => {
      if (!originalOnSearch) return;

      const searchEvent: UserEvent = {
        subFeature: 'Header.Search',
        businessTransactionId: searchTerm,
        type: EventType.User,
        eventName: UsageEventName.TextChanged,
      };
      telemetryClient.trackEvent(searchEvent);

      originalOnSearch(searchTerm);
    };
  }

  const handleLogOutClicked = (): void => {
    const logout: UserEvent = {
      subFeature: 'Header.Logout',
      type: EventType.User,
      eventName: UsageEventName.ButtonClicked,
    };
    telemetryClient.trackEvent(logout);

    authClient.logOut().catch();
  };

  const getPanelOpenHandler = (panel: HeaderPanel): (() => void) => {
    return (): void => {
      const panelEvent: UserEvent = {
        subFeature: `Header.${panel.toString()}`,
        type: EventType.User,
        eventName: UsageEventName.PanelOpened,
        businessTransactionId: panel.toString(),
      };
      telemetryClient.trackEvent(panelEvent);
      telemetryClient.startTrackPage(panel);
    };
  };

  const getPanelDismissHandler = (panel: HeaderPanel): (() => void) => {
    return (): void => {
      const panelEvent: UserEvent = {
        subFeature: `Header.${panel.toString()}`,
        type: EventType.User,
        eventName: UsageEventName.PanelClosed,
        businessTransactionId: panel.toString(),
      };
      telemetryClient.trackEvent(panelEvent);
      telemetryClient.stopTrackPage(panel);
    };
  };

  const notificationConfig: FarRightNotificationPanelProps | undefined = farRightSettings?.notificationsSettings;
  if (notificationConfig) {
    notificationConfig.panelSettings.onOpened = getPanelOpenHandler(HeaderPanel.NotificationPanel);
    notificationConfig.panelSettings.onDismissed = getPanelDismissHandler(HeaderPanel.NotificationPanel);
  }

  const settingsConfig: FarRightSettingsPanelProps | undefined = farRightSettings?.settingsSettings;
  if (settingsConfig) {
    settingsConfig.panelSettings.onOpened = getPanelOpenHandler(HeaderPanel.SettingsPanel);
    settingsConfig.panelSettings.onDismissed = getPanelDismissHandler(HeaderPanel.SettingsPanel);
  }

  const helpConfig: FarRightSettingsPanelProps | undefined = farRightSettings?.helpSettings;
  if (helpConfig) {
    helpConfig.panelSettings.onOpened = getPanelOpenHandler(HeaderPanel.HelpPanel);
    helpConfig.panelSettings.onDismissed = getPanelDismissHandler(HeaderPanel.HelpPanel);
  }

  const feedbackConfig: FarRightFeedbackPanelProps | undefined = farRightSettings?.feedbackSettings;
  if (feedbackConfig) {
    const prevOnClick = farRightSettings?.feedbackSettings?.panelSettings.onClick;
    feedbackConfig.panelSettings.onClick = () => {
      if (!prevOnClick) return false;

      getPanelOpenHandler(HeaderPanel.FeedbackPanel);
      return prevOnClick();
    };
  }

  const profileConfig: FarRightProfilePanelProps = {
    ...farRightSettings?.profileSettings,
    panelSettings: {
      ...farRightSettings?.profileSettings?.panelSettings,
      logOutLink: 'javascript:void(0);',
      fullName: user?.name ?? '',
      emailAddress: user?.email ?? '',
      imageUrl: photo || undefined,
      onLogOut: handleLogOutClicked,
      onOpened: getPanelOpenHandler(HeaderPanel.ProfilePanel),
      onDismissed: getPanelDismissHandler(HeaderPanel.ProfilePanel),
    },
  };

  return (
    <HeaderRoot>
      <CoherenceHeader
        {...otherProps}
        searchSettings={searchConfig}
        farRightSettings={{
          ...farRightSettings,
          notificationsSettings: notificationConfig,
          settingsSettings: settingsConfig,
          helpSettings: helpConfig,
          feedbackSettings: feedbackConfig,
          profileSettings: profileConfig,
        }}
      />
    </HeaderRoot>
  );
}
