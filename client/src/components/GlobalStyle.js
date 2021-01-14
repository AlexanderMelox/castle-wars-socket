import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    /* Colors */
    --color-sky: #7ec0ee;
    --color-grass: #6fd40e;
    --color-grass-border: #5eb10e;
    --color-building: #ffbc42;
    --color-weapons: lightgreen;
    --color-magic: #b4adea;
    --castle-red: #df2935;
    --castle-blue: #00a7e1;
    --color-hp: #555;
    --color-white: #fff;
    /* Text */
    --text-shadow: 6px 6px 0px rgba(0, 0, 0, 0.2);
    --text-shadow--small: 1px 1px 0px rgba(0, 0, 0, 0.2);

    /* Box shadows */
    --box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.2);
  }

  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
  }

  html {
    font-size: 62.5%; /* sets 1rem = 10px */
  }

  body {
    box-sizing: border-box;
    line-height: 1.3;
    font-family: 'Luckiest Guy', cursive;
    letter-spacing: 1px;
    text-shadow: var(--text-shadow--small);
  }
`;

export default GlobalStyle;
