import React from 'react';
import styled from 'styled-components/macro';

import Card from './Card';

const Cards = ({ cards, resources }) => {
  return (
    <CardsContainer>
      {cards.map((card, i) => (
        <Card key={card + i} card={card} resources={resources[card.type]} />
      ))}
    </CardsContainer>
  );
};

export const CardsContainer = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  transition: all 0.1s;
  visibility: visible;
`;

export default Cards;
