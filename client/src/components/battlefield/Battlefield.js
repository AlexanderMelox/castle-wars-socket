import React, { useState, useMemo, useEffect, createContext } from 'react';
import styled from 'styled-components';
import PlayerResources from '../PlayerResources';
import Castle from '../Castle';
import { createHand, getResourcesArray, getOpponent } from '../../utils';
import Cards from '../Cards';

export const CardsContext = createContext();
const turnDelay = 1600;

const Battlefield = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [turnIsInProgress] = useState(false);
  const [activePlayer, setActivePlayer] = useState(0);
  const opponent = useMemo(() => getOpponent(activePlayer), [activePlayer]);
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

  const copyPlayersState = () => [...players];

  // Methods
  const startGame = () => {
    setIsPlaying(true);
  };

  const switchPlayer = () => {
    setActivePlayer(activePlayer === 0 ? 1 : 0);
  };

  const addResources = () => {
    players[activePlayer].resources.bricks += players[activePlayer].resources.builders;
    players[activePlayer].resources.weapons += players[activePlayer].resources.soldiers;
    players[activePlayer].resources.crystals += players[activePlayer].resources.magic;
  };

  const checkIfGameIsOver = () => {
    if (players[1].castleHealth <= 0 || players[0].castleHealth >= 100) {
      setIsGameOver(true);
      alert('Congratulations Player 1 Won!');
    } else if (players[0].castleHealth <= 0 || players[1].castleHealth >= 100) {
      setIsGameOver(true);
      alert('Congratulations Player 2 Won!');
    }
  };

  const skipTurn = () => {
    addResources();
    switchPlayer();
  };

  const showCards = useMemo(() => isPlaying, [isPlaying]);

  // card actions
  const thief = () => {
    const playersCopy = copyPlayersState();
    // 1. Creates an array of resources
    const resourcesArray = getResourcesArray();
    // 2. Loops through each resource and deducts 5
    resourcesArray.forEach((resource) => {
      // Deduct resources from enemy
      if (playersCopy[opponent].resources[resource] < 5) {
        playersCopy[opponent].resources[resource] = 0;
      } else {
        playersCopy[opponent].resources[resource] -= 5;
      }
      // Adds it to the active player
      playersCopy[activePlayer].resources[resource] += 5;
    });
    setPlayers(playersCopy);
  };

  const swat = () => {
    const playersCopy = copyPlayersState();
    playersCopy[opponent].castleHealth -= 10;
    setPlayers(playersCopy);
  };

  const saboteur = () => {
    const playersCopy = copyPlayersState();
    const resourcesArray = getResourcesArray();
    resourcesArray.forEach((resource) => {
      if (playersCopy[opponent].resources[resource] <= 4) {
        playersCopy[opponent].resources[resource] = 0;
      } else {
        playersCopy[opponent].resources[resource] -= 4;
      }
    });
    setPlayers(playersCopy);
  };

  const attack = (player, dmg) => {
    const playersCopy = copyPlayersState();
    if (playersCopy[player].gateHealth <= 0) {
      playersCopy[player].castleHealth -= dmg;
    } else if (playersCopy[player].gateHealth < dmg) {
      const diff = dmg - playersCopy[player].gateHealth;
      playersCopy[player].gateHealth = 0;
      playersCopy[player].castleHealth -= diff;
    } else {
      playersCopy[player].gateHealth -= dmg;
    }
    setPlayers(playersCopy);
  };

  const hire = (type) => {
    // hires a builder, soldier or magician
    const playersCopy = copyPlayersState();
    playersCopy[activePlayer].resources[type] += 1;
    setPlayers(playersCopy);
  };

  const addToFence = (amount) => {
    const playersCopy = copyPlayersState();
    playersCopy[activePlayer].gateHealth += amount;
    setPlayers(playersCopy);
  };

  const addToCastle = (amount) => {
    const playersCopy = copyPlayersState();
    playersCopy[activePlayer].castleHealth += amount;
    setPlayers(playersCopy);
  };

  const reserve = () => {
    // +8 to the castle health and -4 on gate health
    const playersCopy = copyPlayersState();
    playersCopy[activePlayer].castleHealth += 8;
    if (playersCopy[activePlayer].gateHealth < 4) {
      playersCopy[activePlayer].gateHealth = 0;
    } else {
      playersCopy[activePlayer].gateHealth -= 4;
    }
    setPlayers(playersCopy);
  };

  const wain = () => {
    // +8 castle and -4 castle on enemy
    const playersCopy = copyPlayersState();
    playersCopy[activePlayer].castleHealth += 8;
    playersCopy[opponent].castleHealth -= 4;
    setPlayers(playersCopy);
  };

  const conjure = (type) => {
    const playersCopy = copyPlayersState();
    playersCopy[activePlayer].resources[type] += 8;
    setPlayers(playersCopy);
  };

  const curse = () => {
    const playersCopy = copyPlayersState();
    const resourcesArray = Object.keys(playersCopy[activePlayer].resources);

    // add +1 to active player
    resourcesArray.forEach((resource) => {
      playersCopy[activePlayer].resources[resource] += 1;
      // remove -1 from the opponent
      if (playersCopy[opponent].resources[resource] > 0) {
        playersCopy[opponent].resources[resource] -= 1;
      }
    });
    setPlayers(playersCopy);
  };

  const cardActions = {
    thief,
    swat,
    saboteur,
    attack,
    hire,
    addToFence,
    addToCastle,
    reserve,
    wain,
    conjure,
    curse,
  };

  const onCardClick = (card) => {
    console.log(card);
  };

  return (
    <CardsContext.Provider value={{ cardActions, activePlayer, onCardClick }}>
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
              <SkipButton onClick={() => curse()}>Skip turn</SkipButton>
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
              <Castle player="Player 1" castleHealth={players[0].castleHealth} gateHealth={players[0].gateHealth} />
              <Castle player="Player 2" castleHealth={players[1].castleHealth} gateHealth={players[1].gateHealth} />
            </>
          )}
        </BattlefieldTop>
        <BattlefieldBottom>
          {showCards && <Cards cards={players[activePlayer].cards} resources={players[activePlayer].resources} />}
        </BattlefieldBottom>
      </BattlefieldContainer>
    </CardsContext.Provider>
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
