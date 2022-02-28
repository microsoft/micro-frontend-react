import { SharedExampleActionType, IRequestProfileAction, IReceiveProfileAction } from './SharedExample.action-types';
import { IProfile } from './SharedExample.types';

export function requestMyProfile(): IRequestProfileAction {
    return {
        type: SharedExampleActionType.REQUEST_MY_PROFILE
    };
}

export function receiveFriendByEmail(profile: IProfile): IReceiveProfileAction {
    return {
        type: SharedExampleActionType.RECEIVE_MY_PROFILE,
        profile
    };
}
