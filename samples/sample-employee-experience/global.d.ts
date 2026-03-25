import * as styledUMD from 'styled-components';

export declare global {
  const styled: typeof styledUMD.default;
  const __IS_DEVELOPMENT__: boolean;
  const __APP_NAME__: string;
  const __CLIENT_ID__: string;
  const __BASE_URL__: string;
  const __INSTRUMENTATION_KEY__: string;
  const __MSAL__: boolean;
}
