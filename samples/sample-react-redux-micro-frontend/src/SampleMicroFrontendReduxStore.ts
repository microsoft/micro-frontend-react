import { SagaIterator } from 'redux-saga';
import { getContext, put, all, takeLatest, call } from 'redux-saga/effects';

export type SampleUser = {
  name: string;
  email: string;
};

export type MicroFrontendState = {
  user?: SampleUser;
};

export enum MicroFrontendActionType {
  'REQUEST_USER' = 'REQUEST_USER',
  'RECEIVE_USER' = 'RECEIVE_USER',
}

type MicroFrontendAction =
  | {
      type: MicroFrontendActionType.REQUEST_USER;
    }
  | {
      type: MicroFrontendActionType.RECEIVE_USER;
      user: SampleUser;
    };

export function microFrontendReducer(prev: MicroFrontendState = {}, action: MicroFrontendAction) {
  switch (action.type) {
    case MicroFrontendActionType.RECEIVE_USER:
      return {
        user: action.user,
      };
    default:
      return prev;
  }
}

function* fetchUser(): SagaIterator {
  const httpClient = yield getContext('httpClient');

  const user = yield call([httpClient, httpClient.get], 'http://localhost:9000/api/user.json');

  yield put({
    type: MicroFrontendActionType.RECEIVE_USER,
    user,
  });
}

export function* microFrontendSagas(): SagaIterator {
  yield all([takeLatest(MicroFrontendActionType.REQUEST_USER, fetchUser)]);
}
