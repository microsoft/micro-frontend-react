import {
    PublicClientApplication,
    AccountInfo,
    Configuration,
    AuthenticationResult,
    BrowserAuthError,
    InteractionRequiredAuthError,
} from '@azure/msal-browser';
import { ILoginOptions, IAuthClient, ITelemetryClient, TelemetryEvents, IUser } from '../../Models';
import { IIDTokenClaim, IMSALV2ClientOptions } from './MSALV2Client.types';

export class MSALV2Client implements IAuthClient {
    public readonly authContext: PublicClientApplication;
    private readonly config: Configuration;
    private readonly telemetryClient: ITelemetryClient;
    private account: AccountInfo | null = null;
    private readonly options: IMSALV2ClientOptions;

    // Tracks whether there has been another login request during login redirect
    // If another login is called before login redirect is completed,
    // MSAL will throw interaction_in_progress exception
    private isLoginRequested = false;
    // Tracks whether the login redirect has been completed
    private isRedirectComplete = false;
    // Tracks all acquireTokens requests made during login redirection
    private acquireTokenRequests: {
        [key: string]: ((token: string) => void)[];
    } = {};
    // Tracks all getUser requests made during login redirection
    private getUserRequests: ((user: IUser | null) => void)[] = [];

    public constructor(
        config: Configuration,
        telemetryClient: ITelemetryClient,
        options: IMSALV2ClientOptions | undefined = {}
    ) {
        this.telemetryClient = telemetryClient;
        this.config = config;
        this.authContext = new PublicClientApplication({
            auth: config.auth,
            cache: {
                cacheLocation: 'sessionStorage',
                ...config.cache,
            },
        });
        this.options = options;

        this.authContext.handleRedirectPromise().then(this.handleRedirectCompleted.bind(this));
    }

    public login(loginOptions: ILoginOptions | undefined = {}): Promise<void> {
        return new Promise(async (resolve, reject): Promise<void> => {
            this.telemetryClient.trackTrace({
                message: TelemetryEvents.UserLogInRequested,
            });

            try {
                if (this.isRedirectComplete) {
                    await this.authContext.loginRedirect({
                        scopes: loginOptions?.scopes ?? [],
                    });
                } else {
                    this.isLoginRequested = true;
                }

                resolve();
            } catch (ex) {
                this.telemetryClient.trackTrace({
                    message: TelemetryEvents.UserLoginFailed,
                });

                if (ex instanceof BrowserAuthError) {
                    sessionStorage.clear();
                    await this.authContext.loginRedirect({
                        scopes: loginOptions?.scopes ?? [],
                    });
                } else {
                    reject(ex);
                }
            }
        });
    }

    public logOut(): Promise<void> {
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

    public getUser(): Promise<IUser | null> {
        return new Promise(async (resolve): Promise<void> => {
            if (this.isRedirectComplete) {
                const user = await this.getUserInner();
                resolve(user);
            } else {
                this.addGetUserRequest(resolve);
            }
        });
    }

    public getUserId(): Promise<string | null> {
        return new Promise(async (resolve, reject): Promise<void> => {
            try {
                const user = await this.getUser();

                resolve(user ? user.id : null);
            } catch (ex) {
                reject(ex);
            }
        });
    }

    public isLoggedIn(): Promise<boolean> {
        return new Promise(async (resolve, reject): Promise<void> => {
            try {
                const user = await this.getUser();
                resolve(!!user);
            } catch (ex) {
                reject(ex);
            }
        });
    }

    public acquireToken(scopes: string | string[]): Promise<string | null> {
        return new Promise(async (resolve): Promise<void> => {
            if (this.isRedirectComplete && this.account) {
                const accessToken = await this.acquireTokenSilent(scopes);

                resolve(accessToken);
            } else {
                this.addAcquireTokenRequest(scopes, resolve);
            }
        });
    }

    private handleRedirectCompleted(response: AuthenticationResult | null): void {
        this.account = (response?.account as AccountInfo) || this.getCachedUser();
        this.isRedirectComplete = true;

        // Trigger login only if login redirection completed without the account info
        // This means there was no login request perviously
        if (this.isLoginRequested && !this.account) {
            this.login().catch();

            return;
        }

        if (this.account) {
            this.flushAcquireTokenRequests();
        }

        this.flushGetUserRequests();
    }

    private getUserInner(): Promise<IUser | null> {
        return new Promise((resolve, reject): void => {
            try {
                const user = this.getCachedUser();
                if (!user) {
                    resolve(null);
                    return;
                }

                resolve({
                    id: user.username,
                    email: user.username,
                    name: user.name || this.getNameFromIdToken(user.idTokenClaims as IIDTokenClaim) || '',
                    oid: user.homeAccountId,
                });
            } catch (ex) {
                reject(ex);
            }
        });
    }

    private getCachedUser() {
        const activeAccount = this.authContext.getActiveAccount();
        if (activeAccount) return activeAccount;

        const users = this.authContext.getAllAccounts();
        if (!users || users.length === 0) return null;
        if (users.length === 1) {
            const selectedUser = users[0];
            this.authContext.setActiveAccount(selectedUser);

            return selectedUser;
        }

        if (users.length > 1) {
            if (this.options.onMultipleAccountFound) {
                const selectedUser = this.options.onMultipleAccountFound(users);
                if (selectedUser) {
                    this.authContext.setActiveAccount(selectedUser);

                    return selectedUser;
                }
            }

            throw new Error('MultipleAccountFound');
        }
    }

    private normalizeScopes(scopes: string | string[]): string[] {
        let normalizedScopes: string[] = [];
        if (typeof scopes === 'string') normalizedScopes.push(scopes + '/.default');
        else normalizedScopes = [...scopes];

        return normalizedScopes;
    }

    private addGetUserRequest(callback: (user: IUser | null) => void) {
        this.getUserRequests.push(callback);
    }

    private flushGetUserRequests(): void {
        this.getUserRequests.forEach((cb) => {
            this.getUserInner().then(cb);
        });
    }

    private addAcquireTokenRequest(scopes: string | string[], callback: (token: string) => void): void {
        const normalizedScopes = this.normalizeScopes(scopes);
        const key = normalizedScopes.join(',');

        this.acquireTokenRequests[key] = this.acquireTokenRequests[key] || [];
        this.acquireTokenRequests[key].push(callback);
    }

    private flushAcquireTokenRequests(): void {
        for (const key in this.acquireTokenRequests) {
            const scopes = key.split(',');
            this.acquireTokenSilent(scopes).then((accessToken) => {
                this.acquireTokenRequests[key].forEach((cb) => {
                    cb(accessToken);
                });
            });
        }
    }

    private async acquireTokenSilent(scopes: string | string[]): Promise<string> {
        return new Promise((resolve): void => {
            const normalizedScopes = this.normalizeScopes(scopes);

            this.authContext
                .acquireTokenSilent({
                    authority: this.config.auth?.authority,
                    scopes: normalizedScopes,
                    account: this.account as AccountInfo,
                    correlationId: this.telemetryClient.getCorrelationId(),
                    redirectUri: this.config.auth?.redirectUri || window.location.origin,
                })
                .then(({ accessToken }: { accessToken: string }) => {
                    if (accessToken) {
                        resolve(accessToken);

                        return;
                    }

                    // Azure B2C does not return access token if login did not return access token for the scope requested.
                    // Throw exception to trigger acquireTokenRedirect
                    throw new Error('NoAccessTokenReceived');
                })
                .catch((e: Error) => {
                    if (this.options.onAcquireTokenError) {
                        this.options.onAcquireTokenError(e, scopes);
                    } else {
                        if (e instanceof InteractionRequiredAuthError) {
                            // fallback to interaction when silent call fails
                            this.authContext.acquireTokenRedirect({
                                authority: this.config.auth?.authority,
                                scopes: normalizedScopes,
                                correlationId: this.telemetryClient.getCorrelationId(),
                                redirectUri: this.config.auth?.redirectUri || window.location.origin,
                            });
                        }
                    }
                });
        });
    }

    private getNameFromIdToken(idTokenClaim: IIDTokenClaim): string {
        if (!idTokenClaim) return '';
        if (idTokenClaim.family_name && idTokenClaim.given_name) {
            return `${idTokenClaim.given_name} ${idTokenClaim.family_name}`;
        }

        return '';
    }
}
