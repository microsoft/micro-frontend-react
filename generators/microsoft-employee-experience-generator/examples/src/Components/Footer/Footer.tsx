import * as React from 'react';
import * as Styled from './Footer.styled';

export function Footer(
  // eslint-disable-next-line @typescript-eslint/ban-types
  props: React.PropsWithChildren<{}>
): React.ReactElement | null {
  return <Styled.FooterRoot>{props.children}</Styled.FooterRoot>;
}
