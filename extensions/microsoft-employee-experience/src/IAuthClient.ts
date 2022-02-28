import { IUser } from './IUser';

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
