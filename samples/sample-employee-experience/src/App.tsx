import { CoherenceTheme } from '@coherence-design-system/styles';
import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { initializeOBFeedback } from '@coherence-design-system/controls';
import { useLoginOnStartup } from '@micro-frontend-react/employee-experience/lib/useLoginOnStartup';
import { Header } from './Components/Header';
import { Nav } from './Components/Nav';
import { Main } from './Components/Main';
import { ShellWithStore } from './ShellWithStore';
import { navConfig } from './navConfig';
import { Routes } from './Routes';
import { useHeaderConfig } from './useHeaderConfig';
import { loadTheme, ThemeProvider } from '@fluentui/react';

initializeOBFeedback(
  1111,
  'running-environment',
  '/ocv/OfficeBrowserFeedback.min.js',
  '/ocv/OfficeBrowserFeedback.min.css',
  '/ocv/intl/',
  'https://office365.uservoice.com/'
);

function App(): React.ReactElement {
  useLoginOnStartup();
  loadTheme(CoherenceTheme);
  const headerConfig = useHeaderConfig();

  return (
    <BrowserRouter>
      <ThemeProvider theme={CoherenceTheme}>
        <Header {...headerConfig} />
        <Nav groups={navConfig} />
        <Main>
          <Routes />
        </Main>
      </ThemeProvider>
    </BrowserRouter>
  );
}

render(
  <ShellWithStore>
    <App />
  </ShellWithStore>,
  document.getElementById('app')
);
