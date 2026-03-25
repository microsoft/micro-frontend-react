import * as React from 'react';
import { ICoherenceHeaderProps } from '@coherence-design-system/controls/lib/header';

export function useHeaderConfig(): ICoherenceHeaderProps {
  return {
    headerLabel: __APP_NAME__,
    appNameSettings: {
      label: __APP_NAME__,
    },
    searchSettings: {
      placeholder: 'Search...',
      onSearch: (term: string): void => alert(term),
    },
    farRightSettings: {
      notificationsSettings: {
        panelSettings: {
          items: [],
          newNotifications: 1,
        },
      },
      feedbackSettings: {
        panelSettings: {
          ocvButtonIsFocused: false,
          onClick: () => {
            return true;
          },
          launchOptions: {
            categories: {
              show: true,
              customCategories: ['Dashboard', 'Feed', 'Catalog', 'Vision', 'Hearing', 'Mobility', 'Cognitive'],
            },
          },
        },
      },
      settingsSettings: {
        panelSettings: {
          body: <>Settings Contents</>,
        },
      },
      helpSettings: {
        panelSettings: {
          body: <>Help Contents</>,
        },
      },
    },
  };
}
