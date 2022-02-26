import { IUser } from '@microsoft/micro-frontend/lib/Models/IUser';
import { IAuthClient, ILoginOptions } from '@microsoft/micro-frontend/lib/Models/IAuthClient';

export class DummyAuthClient implements IAuthClient {
  readonly authContext: unknown;

  acquireToken(resourceOrScopes: string | string[]): Promise<string | null> {
    throw new Error('Not implemented');
  }

  getUser(): Promise<IUser | null> {
    return Promise.resolve({
      id: '',
      oid: '',
      name: 'Sample User',
      email: 'sample@user.com',
    });
  }

  getUserId(): Promise<string | null> {
    throw new Error('Not implemented');
  }

  isLoggedIn(): Promise<boolean> {
    throw new Error('Not implemented');
  }

  logOut(): Promise<void> {
    throw new Error('Not implemented');
  }

  login(loginOptions?: ILoginOptions): Promise<void> {
    throw new Error('Not implemented');
  }
}
