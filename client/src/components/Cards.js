import React from 'react';
import styled from 'styled-components/macro';

import Card from './Card';

const Cards = ({ cards, resources, isCurrentUser, userId }) => {
  return (
    <CardsContainer>
      {isCurrentUser
        ? cards.map((card, i) => (
        <Card key={card + i} card={card} resources={resources[card.type]} />
      ))
      : <WaitingLabel>
        Waiting for Player {userId === 0 ? '2' : '1'} to finish their turn...
      </WaitingLabel>
    }
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

export const WaitingLabel = styled.p`
  font-size: 18px;
`;

export default Cards;
