import { AccountInfo } from '@azure/msal-browser';

export interface IAuthClientOptions {
  onLogin?(): void;
  onLoginFailed?(): void;
  onLogout?(): void;
  onLogoutFailed?(): void;
  onMultipleAccountFound?: (users: AccountInfo[]) => AccountInfo;
  onAcquireTokenError?: (e: Error, scopes: string | string[]) => void;
}

export interface IIDTokenClaim {
  family_name?: string;
  given_name?: string;
  oid?: string;
}
