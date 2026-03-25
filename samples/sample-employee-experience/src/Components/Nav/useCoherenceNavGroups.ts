import { useContext, useState, useEffect, Context as ReactContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
  INavLinkGroup as IBaseNavLinkGroup,
  INavLink as IBaseNavLink,
} from '@coherence-design-system/controls/lib/nav';
import { Context } from '@micro-frontend-react/employee-experience/lib/Context';
import { IEmployeeExperienceContext } from '@micro-frontend-react/employee-experience/lib/IEmployeeExperienceContext';
import { shouldUseAnchorTag } from '@micro-frontend-react/employee-experience/lib/Link';
import { INavLinkGroup, INavLink } from './Nav.types';

const rootHref = '/';

function isLinkSelected(href: string): boolean {
  const { pathname } = window.location;
  if (href === rootHref) return pathname === href;

  return pathname.startsWith(href);
}

export function useCoherenceNavGroups(groups: INavLinkGroup[]): IBaseNavLinkGroup[] {
  const { telemetryClient } = useContext(Context as ReactContext<IEmployeeExperienceContext>);
  const history = useHistory();
  const [navGroups, setNavGroups] = useState<IBaseNavLinkGroup[]>([]);

  const createLinkGroup = (groups: INavLinkGroup[]) => {
    return groups.map(({ links: groupLinks, ...otherGroupProps }): IBaseNavLinkGroup => {
      return {
        ...otherGroupProps,
        links: createChildLinks(groupLinks) || [],
      };
    });
  };

  const createLink = (name: string, href: string) => {
    return {
      name,
      onClick: (): void => {
        telemetryClient.trackTrace({
          message: 'NavLinkClicked',
          properties: {
            linkName: name,
            href,
          },
        });

        if (shouldUseAnchorTag(href, false)) {
          window.open(href);
        } else {
          history.push(href);
          setNavGroups(createLinkGroup(groups));
        }
      },
      isSelected: isLinkSelected(href),
    };
  };

  const createChildLinks = (childLinks: INavLink[] | undefined): IBaseNavLink[] | undefined => {
    if (!childLinks) return;

    return childLinks.map(({ links, href, name, ...otherLinkProps }): IBaseNavLink => {
      return {
        ...(otherLinkProps as IBaseNavLink),
        ...createLink(name, href),
        links: createChildLinks(links),
      };
    });
  };

  useEffect(() => {
    setNavGroups(createLinkGroup(groups));
  }, [groups]);

  return navGroups;
}
