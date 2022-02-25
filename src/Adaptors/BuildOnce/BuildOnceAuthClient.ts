import { IConfiguration } from '@microsoft/myhub_webauth_sdk/dist/IConfiguration';
import { MyHubWebAuthSDK } from '@microsoft/myhub_webauth_sdk/dist/MyHubWebAuthSDK';
import { IAuthClient, ILoginOptions, IUser } from '../../Models';
import decode from 'jwt-decode';

export type BuildOnceAuthClientConfig = IConfiguration & {
    testAccessToken?: string;
}

export class BuildOnceAuthClient implements IAuthClient {
    public authContext: MyHubWebAuthSDK;
    private readonly testAccessToken: string | undefined;

    public constructor(config: BuildOnceAuthClientConfig) {
        this.authContext = new MyHubWebAuthSDK(config);
        this.authContext.initialize();

        this.testAccessToken = config.testAccessToken;
    }

    login(loginOptions?: ILoginOptions): Promise<void> {
        throw new Error('Logging in is not supported');
    }

    logOut(): Promise<void> {
        throw new Error('Logging out is not supported');
    }

    async getUser(): Promise<IUser | null> {
        const token = await this.acquireToken([]);
        if (!token) return null;

        const decoded = decode(token);
        console.log(decoded);

        return {
            id: '',
            oid: '',
            name: '',
            email: '',
        };
    }

    async getUserId(): Promise<string | null> {
        return (await this.getUser())?.id ?? null;
    }

    isLoggedIn(): Promise<boolean> {
        throw new Error('Checking if user is logged in is not supported');
    }

    async acquireToken(resourceOrScopes: string | string[] = []): Promise<string | null> {
        if (this.testAccessToken) {
            return this.testAccessToken;
        }

        return await this.authContext.acquireMyhubAPIMToken();
    }
}
