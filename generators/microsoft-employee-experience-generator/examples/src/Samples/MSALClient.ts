// Please note this sample is no longer maintained, and only provided in case you were using them in your application.
// To use, simply copy over the file to your project, and use them in place of old reference from the @employee-experience packages
//
// This file can be safely deleted
//
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { UserAgentApplication, Configuration } from 'msal';
import { IAuthClient, ILoginOptions, ITelemetryClient, IUser } from '@employee-experience/common/lib/Models';
import { TelemetryEvents } from '@employee-experience/common/lib/TelemetryEvents';

export class MSALClient implements IAuthClient {
  public readonly authContext: UserAgentApplication;
  private readonly telemetryClient: ITelemetryClient;
  private readonly config: Configuration;

  public constructor(options: Configuration, telemetryClient: ITelemetryClient) {
    this.config = options;
    this.authContext = new UserAgentApplication({
      ...options,
      cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: this.isIE(),
        ...options.cache,
      },
      auth: options.auth,
    });
    this.telemetryClient = telemetryClient;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.authContext.handleRedirectCallback(() => {});
  }

  public async login(loginOptions: ILoginOptions | undefined = {}): Promise<void> {
    return new Promise((resolve, reject): void => {
      this.telemetryClient.trackTrace({
        message: TelemetryEvents.UserLogInRequested,
      });

      try {
        this.authContext.loginRedirect({
          scopes: loginOptions?.scopes,
        });
        resolve();
      } catch (ex) {
        this.telemetryClient.trackTrace({
          message: TelemetryEvents.UserLoginFailed,
        });
        reject(ex);
      }
    });
  }

  public async logOut(): Promise<void> {
    return new Promise((resolve, reject): void => {
      this.telemetryClient.trackTrace({
        message: TelemetryEvents.UserLogOutRequested,
      });

      try {
        this.authContext.logout();
        resolve();
      } catch (ex) {
        this.telemetryClient.trackTrace({
          message: TelemetryEvents.UserLogOutFailed,
        });
        reject(ex);
      }
    });
  }

  public async getUser(): Promise<IUser | null> {
    return new Promise((resolve, reject): void => {
      try {
        const user = this.authContext.getAccount();
        if (!user) return resolve(null);

        resolve({
          id: user.userName,
          email: user.userName,
          name: user.name,
          oid: user.accountIdentifier,
        });
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public async getUserId(): Promise<string | null> {
    return new Promise(async (resolve, reject): Promise<void> => {
      try {
        const user = await this.getUser();

        resolve(user ? user.id : null);
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public async isLoggedIn(): Promise<boolean> {
    return new Promise(async (resolve, reject): Promise<void> => {
      try {
        resolve((await this.getUser()) !== null);
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public async acquireToken(scopes: string | string[]): Promise<string | null> {
    return new Promise((resolve): void => {
      let normalizedScopes: string[] = [];
      if (typeof scopes === 'string') normalizedScopes.push(scopes + '/.default');
      else normalizedScopes = [...scopes];

      this.authContext
        .acquireTokenSilent({
          scopes: normalizedScopes,
          authority: this.config.auth?.authority,
          redirectUri: (this.config.auth?.redirectUri as string) || window.location.origin,
        })
        .then((tokenResponse) => {
          resolve(tokenResponse.accessToken);
        })
        .catch(() => {
          this.authContext.acquireTokenRedirect({
            scopes: normalizedScopes,
            authority: this.config.auth?.authority,
            redirectUri: (this.config.auth?.redirectUri as string) || window.location.origin,
          });
        });
    });
  }

  private isIE(): boolean {
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('MSIE ') > -1;
    const msie11 = ua.indexOf('Trident/') > -1;

    return msie || msie11;
  }
}
