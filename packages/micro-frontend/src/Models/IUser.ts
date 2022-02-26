export interface IUser {
  id: string;
  email: string;
  name: string;
  // This property is only available while using MSAL Client
  oid?: string;
}
