import {
  IPersonaProps as IFabricPersonaProps,
  PersonaInitialsColor,
} from '@fluentui/react/lib/components/Persona/Persona.types';

export interface IPersonaProps extends IFabricPersonaProps {
  emailAlias?: string;
}

export { PersonaInitialsColor };

export enum PersonaSize {
  /**
   * Deprecated in favor of standardized numeric sizing.
   * @deprecated Use `size8` instead.
   */
  tiny = 0,
  /**
   * Deprecated in favor of standardized numeric sizing.
   * @deprecated Use `size24` instead.
   */
  extraExtraSmall = 1,
  /**
   * Deprecated in favor of standardized numeric sizing.
   * @deprecated Use `size32` instead.
   */
  extraSmall = 2,
  /**
   * Deprecated in favor of standardized numeric sizing.
   * @deprecated Use `size40` instead.
   */
  small = 3,
  /**
   * Deprecated in favor of standardized numeric sizing.
   * @deprecated Use `size48` instead.
   */
  regular = 4,
  /**
   * Deprecated in favor of standardized numeric sizing.
   * @deprecated Use `size72` instead.
   */
  large = 5,
  /**
   * Deprecated in favor of standardized numeric sizing.
   * @deprecated Use `size100` instead.
   */
  extraLarge = 6,
  /**
   * No `PersonaCoin` is rendered.
   */
  size8 = 17,
  /**
   * No `PersonaCoin` is rendered. Deprecated to align with design specifications.
   * @deprecated Use `size8` instead.
   */
  size10 = 9,
  /**
   * Renders a 16px `PersonaCoin`.
   * @deprecated Deprecated due to not being in the design specification.
   */
  size16 = 8,
  /**
   * Renders a 24px `PersonaCoin`.
   */
  size24 = 10,
  /**
   * Renders a 28px `PersonaCoin`.
   * @deprecated Deprecated due to not being in the design specification.
   */
  size28 = 7,
  /**
   * Renders a 32px `PersonaCoin`.
   */
  size32 = 11,
  /**
   * Renders a 40px `PersonaCoin`.
   */
  size40 = 12,
  /**
   * Renders a 48px `PersonaCoin`.
   */
  size48 = 13,
  /**
   * Renders a 56px `PersonaCoin`.
   */
  size56 = 16,
  /**
   * Renders a 72px `PersonaCoin`.
   */
  size72 = 14,
  /**
   * Renders a 100px `PersonaCoin`.
   */
  size100 = 15,
  /**
   * Renders a 120px `PersonaCoin`.
   */
  size120 = 18,
}
