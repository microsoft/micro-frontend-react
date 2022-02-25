import { AccountInfo } from '@azure/msal-browser';

export interface IMSALV2ClientOptions {
    onMultipleAccountFound?: (users: AccountInfo[]) => AccountInfo;
    onAcquireTokenError?: (e: Error, scopes: string | string[]) => void;
}

export interface IIDTokenClaim {
    family_name?: string;
    given_name?: string;
    oid?: string;
}
