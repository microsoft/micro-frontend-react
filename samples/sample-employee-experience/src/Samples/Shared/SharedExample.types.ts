import { IDefaultState } from '@micro-frontend-react/employee-experience/lib/IDefaultState';
import { sharedExampleReducerName } from './SharedExample.reducer';

export interface IExampleAppState extends IDefaultState {
  dynamic?: {
    [sharedExampleReducerName]: ISharedExampleState;
  };
}

export interface ISharedExampleState {
  profile: IProfile | null;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export interface IProfile {
  userPrincipalName: string;
  displayName: string;
  jobTitle: string;
  officeLocation: string;
}
