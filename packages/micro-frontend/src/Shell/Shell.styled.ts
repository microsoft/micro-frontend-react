import { createGlobalStyle } from 'styled-components';

export const ShellStyles = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: border-box;
  }

  html {
    height: 100%;
  }

  body {
    position: relative;
    height: 100%;
    margin: 0;
    color: #333;
    background-color: #F2F2F2;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, p, ul {
    margin: 0;
  }

  button {
    cursor: pointer;
  }

  a {
    cursor: pointer;
    text-decoration: none;
  }

  ul {
    list-style: none;
  }

  body > iframe {
    display: none;
  }

  #app {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  @keyframes placeholderBlinks {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
`;
