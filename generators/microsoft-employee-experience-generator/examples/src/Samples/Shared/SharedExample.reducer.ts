import { ISharedExampleState } from './SharedExample.types';
import { SharedExampleAction, SharedExampleActionType } from './SharedExample.action-types';

export const sharedExampleReducerName = 'SharedExampleReducer';
export const sharedExampleInitialState: ISharedExampleState = {
    profile: null,
    isLoading: false,
    hasError: false,
    errorMessage: null
};

export function sharedExampleReducer(
    prev: ISharedExampleState = sharedExampleInitialState,
    action: SharedExampleAction
): ISharedExampleState {
    switch (action.type) {
        case SharedExampleActionType.REQUEST_MY_PROFILE:
            return {
                ...prev,
                isLoading: true,
                hasError: false
            };

        case SharedExampleActionType.RECEIVE_MY_PROFILE:
            return {
                ...prev,
                isLoading: false,
                hasError: false,
                profile: action.profile
            };
        default:
            return prev;
    }
}
