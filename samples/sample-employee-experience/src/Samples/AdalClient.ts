// Please note this sample is no longer maintained, and only provided in case you were using them in your application.
// To use, simply copy over the file to your project, and use them in place of old reference from the @employee-experience packages
// This file can be safely deleted
//
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import AuthenticationContext, { Options } from 'adal-angular';
import { IAuthClient } from '@employee-experience/common/lib/Models/IAuthClient';
import { ITelemetryClient } from '@employee-experience/common/lib/Models/ITelemetryClient';
import { TelemetryEvents } from '@employee-experience/common/lib/TelemetryEvents';
import { IUser } from '@employee-experience/common/v5/Models/IUser';

export class ADALClient implements IAuthClient {
  public readonly authContext: AuthenticationContext;
  private readonly telemetryClient: ITelemetryClient;

  public constructor(options: Options, telemetryClient: ITelemetryClient) {
    this.authContext = new AuthenticationContext({
      cacheLocation: 'localStorage',
      redirectUri: window.location.origin,
      ...options,
    });

    this.authContext.handleWindowCallback();
    this.telemetryClient = telemetryClient;
  }

  public async login(): Promise<void> {
    return new Promise((resolve, reject): void => {
      this.telemetryClient.trackTrace({
        message: TelemetryEvents.UserLogInRequested,
      });

      try {
        this.authContext.login();
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
        this.authContext.logOut();
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
        const user = this.authContext.getCachedUser();
        if (!user) return resolve(null);

        resolve({
          id: user.userName,
          email: user.userName,
          name: user.profile ? user.profile.name : '',
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

  public async acquireToken(resource: string): Promise<string | null> {
    return new Promise((resolve, reject): void => {
      this.authContext.acquireToken(resource, (error, token): void => {
        if (error) {
          this.telemetryClient.trackTrace({
            message: TelemetryEvents.AcquireTokenFailed,
            properties: {
              resource,
            },
          });
          this.telemetryClient.trackException({
            exception: new Error(error),
            properties: {
              resource,
            },
          });

          reject(error);

          return;
        }

        resolve(token);
      });
    });
  }
}
