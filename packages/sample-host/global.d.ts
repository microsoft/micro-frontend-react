import * as styledUMD from 'styled-components';

declare global {
  const styled: typeof styledUMD.default;
  const __IS_DEVELOPMENT__: boolean;
  const __APP_NAME__: string;
  const __BASE_URL__: string;
}
