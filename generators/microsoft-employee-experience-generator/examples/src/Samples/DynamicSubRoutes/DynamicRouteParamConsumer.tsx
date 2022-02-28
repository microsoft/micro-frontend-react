import * as React from 'react';
import * as Styled from '../Shared/Layout';
import { useParams } from 'react-router-dom';

export function DynamicRouteParamConsumer(): React.ReactElement {
  const { routeParam } = useParams() as { routeParam: string };

  return <Styled.SectionTitle>Subroute 3 - route param: {routeParam}</Styled.SectionTitle>;
}
