import {
  INavLinkGroup as IBaseNavLinkGroup,
  INavLink as IBaseNavLink,
  INavProps as IBaseNavProps,
} from '@coherence-design-system/controls/lib/nav';

export interface INavLink extends Omit<IBaseNavLink, 'links'> {
  links?: INavLink[];
}

export interface INavLinkGroup extends Omit<IBaseNavLinkGroup, 'links'> {
  links: INavLink[];
}

export interface INavProps extends Omit<IBaseNavProps, 'groups'> {
  appName?: string;
  groups: INavLinkGroup[];
}
