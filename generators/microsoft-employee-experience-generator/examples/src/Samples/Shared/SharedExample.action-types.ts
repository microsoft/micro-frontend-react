import { IProfile } from './SharedExample.types';

export enum SharedExampleActionType {
  REQUEST_MY_PROFILE = 'REQUEST_MY_PROFILE',
  RECEIVE_MY_PROFILE = 'RECEIVE_MY_PROFILE',
}

export type SharedExampleAction = IRequestProfileAction | IReceiveProfileAction;

export interface IRequestProfileAction {
  type: SharedExampleActionType.REQUEST_MY_PROFILE;
}

export interface IReceiveProfileAction {
  type: SharedExampleActionType.RECEIVE_MY_PROFILE;
  profile: IProfile;
}
