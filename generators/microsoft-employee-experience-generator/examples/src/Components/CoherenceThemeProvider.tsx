import * as React from 'react';
import { ThemeProvider } from '@fluentui/react/lib/Theme';
import { loadTheme } from '@fluentui/style-utilities/lib/styles/theme';
import { CoherenceCustomizations } from '@coherence-design-system/styles/lib/CoherenceCustomizations';
import { CoherenceTheme } from '@coherence-design-system/styles';

const StyledThemeProvider = styled(ThemeProvider).attrs(CoherenceCustomizations)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export function CoherenceThemeProvider(props: React.PropsWithChildren<unknown>): React.ReactElement {
  loadTheme(CoherenceTheme);

  return <StyledThemeProvider>{props.children}</StyledThemeProvider>;
}
