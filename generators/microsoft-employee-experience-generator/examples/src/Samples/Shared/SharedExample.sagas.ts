import { SimpleEffect, getContext, put, all, call, takeLatest } from 'redux-saga/effects';
import { IHttpClient, IHttpClientResult } from '@employee-experience/common/lib/Models';
import { SharedExampleActionType } from './SharedExample.action-types';
import { receiveFriendByEmail } from './SharedExample.actions';
import { IProfile } from "./SharedExample.types";

const graphBaseUrl = 'https://graph.microsoft.com/v1.0/';
const graphResourceUri = 'https://graph.microsoft.com';

function* fetchProfile(): IterableIterator<SimpleEffect<{}, {}>> {
    const httpClient: IHttpClient = yield getContext('httpClient');
    const { data }: IHttpClientResult<IProfile> = yield call([httpClient, httpClient.request], {
        url: `${graphBaseUrl}/me`,
        resource: graphResourceUri,
    });

    yield put(receiveFriendByEmail(data));
}

export function* sharedExampleSagas(): IterableIterator<{}> {
    yield all([takeLatest(SharedExampleActionType.REQUEST_MY_PROFILE, fetchProfile)]);
}
