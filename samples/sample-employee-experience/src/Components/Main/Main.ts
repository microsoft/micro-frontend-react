import styled from 'styled-components';

export const Main = styled.main`
  width: 100%;
  padding-top: 48px;

  @media (min-width: 1025px) {
    width: calc(100% - 48px);
    margin-left: 48px;
  }
`;
