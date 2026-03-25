import { Context, withContext } from '@micro-frontend-react/employee-experience/lib/Context';
import { IEmployeeExperienceContext } from '@micro-frontend-react/employee-experience/lib/IEmployeeExperienceContext';
import { getFeature, getPageLoadFeature } from '@micro-frontend-react/employee-experience/lib/UsageTelemetryHelper';
import { useDynamicReducer } from '@micro-frontend-react/employee-experience/lib/useDynamicReducer';
import { usePageTitle } from '@micro-frontend-react/employee-experience/lib/usePageTitle';
import { usePageTracking } from '@micro-frontend-react/employee-experience/lib/usePageTracking';
import * as React from 'react';
import { CodeSplitter } from '@micro-frontend-react/employee-experience/lib/CodeSplitter';
import * as Styled from '../Shared/Layout';
import { requestMyProfile } from '../Shared/SharedExample.actions';
import {
  sharedExampleInitialState,
  sharedExampleReducer,
  sharedExampleReducerName,
} from '../Shared/SharedExample.reducer';
import { sharedExampleSagas } from '../Shared/SharedExample.sagas';
import { IExampleAppState } from '../Shared/SharedExample.types';

function CodeSplitting(): React.ReactElement {
  const feature = getFeature(__APP_NAME__, 'CodeSplitting');
  usePageTracking(getPageLoadFeature(feature));
  usePageTitle(`CodeSplitting - ${__APP_NAME__}`);

  useDynamicReducer(sharedExampleReducerName, sharedExampleReducer, [sharedExampleSagas]);

  const { useSelector, dispatch } = React.useContext(Context as React.Context<IEmployeeExperienceContext>);
  const { profile, isLoading, hasError, errorMessage } = useSelector(
    (state: IExampleAppState) => state.dynamic?.[sharedExampleReducerName] || sharedExampleInitialState
  );

  React.useEffect(() => {
    dispatch(requestMyProfile());
  }, [dispatch]);

  return (
    <Styled.Container>
      <Styled.PageHeading>Micro-Frontend Code Splitting</Styled.PageHeading>
      <Styled.PageDescription>
        Example of further splitting Micro-Frontend code into smaller chunks
      </Styled.PageDescription>

      <Styled.SectionTitle>My Profile</Styled.SectionTitle>

      {!profile && isLoading && 'Loading...'}
      {hasError && errorMessage}
      {!isLoading && !hasError && profile && (
        <CodeSplitter
          name="MyProfile"
          import={async () =>
            import(
              // webpackChunkName: 'my-profile'
              './MyProfile'
            )
          }
          props={{ profile }}
        />
      )}
    </Styled.Container>
  );
}

const connected = withContext(CodeSplitting);
export { connected as CodeSplitting };
