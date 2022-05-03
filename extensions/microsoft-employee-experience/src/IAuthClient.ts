import { IUser } from './IUser';

export interface IAuthClient<T = IUser> {
  readonly authContext: unknown;

  login(loginOptions?: ILoginOptions): Promise<void>;

  logOut(): Promise<void>;

  getUser(): Promise<T | null>;

  getUserId(): Promise<string | null>;

  isLoggedIn(): Promise<boolean>;

  acquireToken(resourceOrScopes: string | string[]): Promise<string | null>;
}

export interface ILoginOptions {
  scopes?: string[];
}
