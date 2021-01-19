import React, { useState } from 'react';
import styled from 'styled-components';
import PlayerResources from '../PlayerResources';

import cards from '../../assets/cards';

// Gets a random card from the deck
const newCard = () => cards[Math.floor(Math.random() * cards.length)];

// Create a hand for a player
const createHand = () => {
  const newHand = [];
  for (let i = 0; i < 8; i++) {
    newHand.push(newCard());
  }
  return newHand;
};

const Battlefield = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePlayer, setActivePlayer] = useState(0);
  const [players, setPlayers] = useState([
    {
      resources: {
        builders: 2,
        bricks: 5,
        soldiers: 2,
        weapons: 5,
        magic: 2,
        crystals: 5,
      },
      castleHealth: 30,
      gateHealth: 10,
      cards: createHand(),
    },
    {
      resources: {
        builders: 2,
        bricks: 5,
        soldiers: 2,
        weapons: 5,
        magic: 2,
        crystals: 5,
      },
      castleHealth: 30,
      gateHealth: 10,
      cards: createHand(),
    },
  ]);

  const startGame = () => {
    setIsPlaying(true);
  };

  return (
    <BattlefieldContainer>
      {!isPlaying && (
        <BattlefieldMenu>
          <BattlefieldButtons onClick={startGame}>Play</BattlefieldButtons>
          <BattlefieldButtons>How to Play</BattlefieldButtons>
        </BattlefieldMenu>
      )}
      <BattlefieldTop>
        {isPlaying && (
          <>
            <SkipButton>Skip turn</SkipButton>
            <PlayerResources
              player="Player 1"
              isActivePlayer={activePlayer === 0}
              resources={players[0].resources}
              castleHealth={players[0].castleHealth}
              gateHealth={players[0].gateHealth}
            />
            <PlayerResources
              player="Player 2"
              isActivePlayer={activePlayer === 1}
              resources={players[1].resources}
              castleHealth={players[1].castleHealth}
              gateHealth={players[1].gateHealth}
            />
          </>
        )}
      </BattlefieldTop>
      <BattlefieldBottom>cards</BattlefieldBottom>
    </BattlefieldContainer>
  );
};

const BattlefieldContainer = styled.div`
  grid-area: battlefield;
  display: grid;
  grid-template-rows: 3fr 1fr;
  position: relative;
`;

const BattlefieldTop = styled.div`
  background-color: var(--color-sky);
  position: relative;
`;

export const BattlefieldBottom = styled.div`
  border-top: 5px solid var(--color-grass-border);
  background-color: var(--color-grass);
  z-index: 3000;
`;

export const BattlefieldMenu = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 6000;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const BattlefieldButtons = styled.button`
  outline: none;
  border: none;
  color: var(--color-white);
  font: inherit;
  text-shadow: var(--text-shadow);
  box-shadow: var(--text-shadow);
  font-size: 3rem;
  padding: 1.5rem 4rem;
  border-radius: 2rem;
  margin: 1rem;
  background-color: var(--castle-red);
  cursor: pointer;
  transition: all 0.2s;

  :hover {
    transform: translateY(-3px) scale(1.1);
  }
`;

export const SkipButton = styled.button`
  position: fixed;
  display: inline-block;
  left: 50%;
  top: 8rem;
  transform: translateX(-50%);
  z-index: 9999;
  outline: none;
  border: none;
  color: var(--color-white);
  font: inherit;
  text-shadow: var(--text-shadow-small);
  box-shadow: var(--text-shadow);
  font-size: 1.5rem;
  padding: 1rem 2rem;
  border-radius: 2rem;
  background-color: var(--castle-red);
  cursor: pointer;
  transition: all 0.2s;

  :hover {
    transform: translateY(-3px) translateX(-50%) scale(1.1);
  }
`;

export default Battlefield;