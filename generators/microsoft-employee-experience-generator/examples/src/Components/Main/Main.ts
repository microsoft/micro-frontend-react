import styled from 'styled-components';

// Adds space for nav and header
// flex for stick footer
export const Main = styled.main`
  width: 100%;
  flex: 1 0 auto;
  padding-top: 48px;

  @media (min-width: 1025px) {
    width: calc(100% - 48px);
    margin-left: 48px;
  }
`;
