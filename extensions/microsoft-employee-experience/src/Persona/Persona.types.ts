import {
  IPersonaProps as IFabricPersonaProps,
  PersonaInitialsColor,
  PersonaSize,
} from '@fluentui/react/lib/components/Persona/Persona.types';

export interface IPersonaProps extends IFabricPersonaProps {
  emailAlias?: string;
}

export { PersonaInitialsColor, PersonaSize };
