import * as styledUMD from 'styled-components';

declare global {
  const styled: typeof styledUMD.default;

  const __APP_NAME__: string;
}
