import * as React from 'react';
import * as Styled from '../Shared/Layout';
import { Context, withContext } from '@micro-frontend-react/employee-experience/lib/Context';
import { useDynamicReducer } from '@micro-frontend-react/employee-experience/lib/useDynamicReducer';
import { IEmployeeExperienceContext } from '@micro-frontend-react/employee-experience/lib/IEmployeeExperienceContext';
import { Persona } from '@micro-frontend-react/employee-experience/lib/Persona';
import { usePageTracking } from '@micro-frontend-react/employee-experience/lib/usePageTracking';
import { usePageTitle } from '@micro-frontend-react/employee-experience/lib/usePageTitle';
import { getFeature, getPageLoadFeature } from '@micro-frontend-react/employee-experience/lib/UsageTelemetryHelper';
import {
  sharedExampleReducerName,
  sharedExampleReducer,
  sharedExampleInitialState,
} from '../Shared/SharedExample.reducer';
import { IExampleAppState } from '../Shared/SharedExample.types';
import { sharedExampleSagas } from '../Shared/SharedExample.sagas';
import { requestMyProfile } from '../Shared/SharedExample.actions';

function DynamicReduxHooks(): React.ReactElement {
  const feature = getFeature(__APP_NAME__, 'DynamicReduxHooks');
  usePageTracking(getPageLoadFeature(feature));
  usePageTitle(`Dynamic + Redux + Hooks - ${__APP_NAME__}`);

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
      <Styled.PageHeading>Dynamic + Redux + Hooks</Styled.PageHeading>
      <Styled.PageDescription>
        Example of using dynamic component, connecting to redux using hooks, and using sagas
      </Styled.PageDescription>

      <Styled.SectionTitle>My Profile</Styled.SectionTitle>

      {!profile && isLoading && 'Loading...'}
      {hasError && errorMessage}
      {!isLoading && !hasError && profile && (
        <Persona
          emailAlias={profile.userPrincipalName}
          size={100}
          text={profile.displayName}
          secondaryText={profile.jobTitle}
          optionalText={profile.officeLocation}
        />
      )}
    </Styled.Container>
  );
}

const connected = withContext(DynamicReduxHooks);
export { connected as DynamicReduxHooks };
