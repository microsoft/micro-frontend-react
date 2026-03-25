import { CodeSplitter } from '@micro-frontend-react/employee-experience/lib/CodeSplitter';
import { PersonaSize } from '@micro-frontend-react/employee-experience/lib/Persona';
import * as React from 'react';
import * as Styled from '../Shared/Layout';
import { withRouter, Switch, Route, RouteComponentProps } from 'react-router-dom';
import { Link } from '@micro-frontend-react/employee-experience/lib/Link';
import {
  getFeature,
  getPageLoadFeature,
  getClickFeature,
} from '@micro-frontend-react/employee-experience/lib/UsageTelemetryHelper';
import { withContext } from '@micro-frontend-react/employee-experience/lib/Context';
import { usePageTitle } from '@micro-frontend-react/employee-experience/lib/usePageTitle';
import { usePageTracking } from '@micro-frontend-react/employee-experience/lib/usePageTracking';
import { RouteComponentProvider } from '@micro-frontend-react/employee-experience/lib/RouteComponentProvider';

function DynamicSubRoutes(props: RouteComponentProps): React.ReactElement {
  const feature = getFeature('DemoApp', 'DynamicSubRoutes');
  usePageTracking(getPageLoadFeature(feature));
  usePageTitle(`Dynamic + SubRoutes - ${__APP_NAME__}`);

  const { match } = props;

  return (
    <Styled.Container>
      <Styled.PageHeading>Dynamic + SubRoutes</Styled.PageHeading>
      <Styled.PageDescription>
        Example of defining subroutes of dynamic component. Click on below links to go to sub routes
      </Styled.PageDescription>

      <Styled.Space>
        <ul>
          <li>
            <Link to={`${match.url}/subroute-1`} title="Go to SubRoute 1" {...getClickFeature(feature, 'SubRoute1')}>
              Subroute 1
            </Link>
          </li>
          <li>
            <Link to={`${match.url}/subroute-2`} title="Go to SubRoute 2" {...getClickFeature(feature, 'SubRoute2')}>
              Subroute 2
            </Link>
          </li>
          <li>
            <Link
              to={`${match.url}/subroute-3/exampleRouteParam`}
              title="Go to SubRoute 3"
              {...getClickFeature(feature, 'SubRoute3')}
            >
              Subroute 3 - Dynamic with route param
            </Link>
          </li>
          <li>
            <Link to={`${match.url}/subroute-4`} title="Go to SubRoute 4" {...getClickFeature(feature, 'SubRoute4')}>
              Subroute 4 - Code splitting
            </Link>
          </li>
        </ul>
      </Styled.Space>

      <Switch>
        <Route
          path={`${match.url}/subroute-1`}
          render={(): React.ReactElement => <Styled.SectionTitle>SubRoute 1</Styled.SectionTitle>}
        />
        <Route
          path={`${match.url}/subroute-2`}
          render={(): React.ReactElement => <Styled.SectionTitle>SubRoute 2</Styled.SectionTitle>}
        />
        <RouteComponentProvider
          path={`${match.url}/subroute-3/:routeParam`}
          config={{
            script: '/bundles/dynamic-route-param-consumer.js',
            name: 'DynamicRouteParamConsumer',
          }}
        />
        <Route
          path={`${match.url}/subroute-4`}
          render={(): React.ReactElement => (
            <CodeSplitter
              name="MyProfile"
              import={async () =>
                import(
                  // webpackChunkName: 'my-profile'
                  '../CodeSplitting/MyProfile'
                )
              }
              props={{
                // @ts-ignore
                profile: {
                  displayName: 'John Doe',
                  jobTitle: 'Test Title',
                },
              }}
            />
          )}
        />
      </Switch>
    </Styled.Container>
  );
}

const connected = withContext(withRouter(DynamicSubRoutes));
export { connected as DynamicSubRoutes };
