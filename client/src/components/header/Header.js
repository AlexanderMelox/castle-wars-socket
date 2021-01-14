import React from 'react';
import styled from 'styled-components';

const Header = () => {
  return (
    <HeaderContainer>
      <HeaderTitle>Castle Wars</HeaderTitle>
    </HeaderContainer>
  );
};

export const HeaderContainer = styled.header`
  grid-area: header;
  padding: 3rem 0;
  background-color: var(--color-sky);
  text-align: center;
`;

export const HeaderTitle = styled.h1`
  font-size: 4rem;
  color: var(--color-white);
  line-height: 1;
  text-shadow: var(--text-shadow);
  z-index: 3000;
  position: relative;
`;

export default Header;
