import { Persona, PersonaSize } from '@micro-frontend-react/employee-experience/lib/Persona';
import * as React from 'react';
import { IProfile } from '../Shared/SharedExample.types';

export function MyProfile(props: { profile: IProfile }): React.ReactElement {
  const { profile } = props;

  return (
    <div>
      <Persona size={PersonaSize.size100} />
      <div>Name: {profile.displayName}</div>
      <div>title: {profile.jobTitle}</div>
    </div>
  );
}
