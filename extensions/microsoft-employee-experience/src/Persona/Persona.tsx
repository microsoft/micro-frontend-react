import * as React from 'react';
import { Persona as FabricPersona } from '@fluentui/react/lib/Persona';
import { GraphPhotoSize } from '../IGraphClient';
import { IPersonaProps, PersonaSize } from './Persona.types';
import { useGraphPhoto } from '../useGraphPhoto';

export const Persona: React.FC<IPersonaProps> = (props: IPersonaProps): React.ReactElement => {
  const { emailAlias } = props;
  const photo = useGraphPhoto(emailAlias, getPixelSize(props.size));

  if (!photo) return <FabricPersona {...props} />;

  return <FabricPersona {...props} imageUrl={photo} />;
};

const getPixelSize = (size: PersonaSize | undefined): GraphPhotoSize => {
  switch (size) {
    case PersonaSize.size8:
    case PersonaSize.size24:
    case PersonaSize.size32:
    case PersonaSize.size40:
    case PersonaSize.size48:
      return 48;
    case PersonaSize.size56:
      return 64;
    case PersonaSize.size72:
      return 96;
    case PersonaSize.size100:
    case PersonaSize.size120:
      return 120;
    default:
      return undefined;
  }
};
