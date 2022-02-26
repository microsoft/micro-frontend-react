import { SagaIterator } from 'redux-saga';
import { getContext, put, all, takeLatest, call } from 'redux-saga/effects';
import { IHttpClient } from '@microsoft/micro-frontend/lib/Models';

export type SampleUser = {
  name: string;
  email: string;
};

export type MicroFrontendState = {
  user?: SampleUser;
};

export enum MicroFrontendActionType {
  'REQUEST_USER' = 'REQUSET_USER',
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
  const httpClient: IHttpClient = yield getContext('httpClient');

  const { data: user } = yield call([httpClient, httpClient.get], 'http://localhost:9000/api/user.json');

  yield put({
    type: MicroFrontendActionType.RECEIVE_USER,
    user,
  });
}

export function* microFrontendSagas(): SagaIterator {
  yield all([takeLatest(MicroFrontendActionType.REQUEST_USER, fetchUser)]);
}
