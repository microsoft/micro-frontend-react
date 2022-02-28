import styled from 'styled-components';

// Adds space for nav
// flex-shrink for stick footer
export const FooterRoot = styled.footer`
  flex-shrink: 0;
  width: 100%;

  @media (min-width: 1025px) {
    width: calc(100% - 48px);
    margin-left: 48px;
  }
`;
