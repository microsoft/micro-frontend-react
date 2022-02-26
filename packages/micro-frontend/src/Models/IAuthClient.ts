import { IUser } from './IUser';

/*
 * Note those functions are changed to async method in anticipation of using social login providers
 */

export interface IAuthClient {
  readonly authContext: unknown;

  login(loginOptions?: ILoginOptions): Promise<void>;

  logOut(): Promise<void>;

  getUser(): Promise<IUser | null>;

  getUserId(): Promise<string | null>;

  isLoggedIn(): Promise<boolean>;

  acquireToken(resourceOrScopes: string | string[]): Promise<string | null>;
}

export interface ILoginOptions {
  scopes?: string[];
}
