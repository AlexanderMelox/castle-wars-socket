import React from 'react';
import styled from 'styled-components';

import GlobalStyle from './components/GlobalStyle';
import Header from './components/header';
import Battlefield from './components/battlefield';

const App = () => {

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header />
        <Battlefield />
      </AppContainer>
    </>
  );
}

const AppContainer = styled.div`
  display: grid;
  grid-template-rows: 10rem calc(100vh - 10rem);
  grid-template-areas:
    'header'
    'battlefield';
  overflow: hidden;
`;

export default App;
