import React, { useState, useMemo, useEffect, createContext, useRef } from 'react';
import styled, { css } from 'styled-components';
import socketIOClient from 'socket.io-client';
import PlayerResources from '../PlayerResources';
import Castle from '../Castle';
import { initResources, getResourcesArray, getOpponent } from '../../utils';
import Cards from '../Cards';

export const CardsContext = createContext();
const turnDelay = 1600;
const ENDPOINT = 'http://localhost:3001';

const socket = socketIOClient(ENDPOINT);

const Battlefield = () => {
  const [socketPlayers, setSocketPlayers] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [turnIsInProgress] = useState(false);
  const [activePlayer, setActivePlayer] = useState(0);
  const opponent = useMemo(() => getOpponent(activePlayer), [activePlayer]);

  const [roomname, setRoomname] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    socket.on('update', (room) => {
      console.log(room);
      // setSocketPlayers(room.users);
    });
  }, []);

  // Returns a mutable copy of the players array
  const copyPlayersState = () => [...socketPlayers];

  // Methods
  const startGame = () => {
    setIsPlaying(true);
    socket.emit('newUser', { name: username, roomId: roomname, resources: initResources() });
  };

  // useEffect(() => {
  //   if (isPlaying && socket) {
  //     try {
  //       let socket = buildSocketUrl();
  //       socket.addEventListener('open', () => {
  //         console.log('SOCKET CONNECTION SUCCESSFUL');
  //         console.log(socketPlayers && socketPlayers.length ? 1 : 0);
  //         socket.send(
  //           JSON.stringify({
  //             name: username,
  //             roomId: roomname,
  //             gameData: socketPlayers && socketPlayers.length === 2 ? players[1] : players[0],
  //             id: socketPlayers && socketPlayers.length === 2 ? 1 : 0,
  //           })
  //         );
  //       });
  //       socket.onmessage = (message) => {
  //         console.log(message);
  //         console.log(message.data);
  //         console.log(JSON.parse(message.data));
  //         const socketUsers = JSON.parse(message.data).users
  //           ? JSON.parse(message.data).users
  //           : [JSON.parse(message.data)];
  //         console.log('new players: ', socketUsers.length);
  //         console.log('existing players: ', socketPlayers.length);
  //         // if users.length is 1 replace the first
  //         // item in `players` and leave the second object

  //         // if users.length is 2 replace the entire `players`
  //         // array that is returned
  //         if (socketUsers && socketUsers.length) {
  //           const clone = [...socketPlayers];
  //           console.log([clone.flat(), socketUsers].flat());
  //           setSocketPlayers(socketUsers);
  //         }

  //         // then this is the end of setting up the game
  //         // there should be a new useEffect to update each players
  //         // game data after each turn
  //       };
  //       socket.addEventListener('close', () => {
  //         console.log('DISCONNECTED');
  //         // remove the user that disconnected
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // }, [socket, username, roomname, isPlaying, players]);

  const switchPlayer = () => {
    setActivePlayer(activePlayer === 0 ? 1 : 0);
  };

  const addResources = () => {
    const playersCopy = copyPlayersState();
    playersCopy[activePlayer].resources.bricks += playersCopy[activePlayer].resources.builders;
    playersCopy[activePlayer].resources.weapons += playersCopy[activePlayer].resources.soldiers;
    playersCopy[activePlayer].resources.crystals += playersCopy[activePlayer].resources.magic;
    setPlayers(playersCopy);
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
            <RoomNameInput
              placeholder="Enter username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <RoomNameInput
              placeholder="Enter room name"
              type="text"
              value={roomname}
              onChange={(event) => setRoomname(event.target.value)}
            />
            <BattlefieldButtons disabled={!username.length || !roomname.length} onClick={startGame}>
              Play
            </BattlefieldButtons>
            <BattlefieldButtons>How to Play</BattlefieldButtons>
          </BattlefieldMenu>
        )}
        <BattlefieldTop>
          {isPlaying && socketPlayers && socketPlayers.length && (
            <>
              {socketPlayers && socketPlayers.length && <RoomLabel>Room: {socketPlayers[0].roomId}</RoomLabel>}
              <SkipButton>Skip turn</SkipButton>
              <PlayerResources
                player={socketPlayers[0].name || 'Player 1'}
                isActivePlayer={activePlayer === 0}
                resources={socketPlayers[0].gameData.resources}
                castleHealth={socketPlayers[0].gameData.castleHealth}
                gateHealth={socketPlayers[0].gameData.gateHealth}
                id={socketPlayers[0].id}
              />
              <PlayerResources
                player={socketPlayers[1]?.name || 'Waiting for player 2 to join'}
                isActivePlayer={activePlayer === 1}
                resources={socketPlayers[1]?.gameData.resources || players[1].resources}
                castleHealth={socketPlayers[1]?.gameData.castleHealth || players[1].castleHealth}
                gateHealth={socketPlayers[1]?.gameData.gateHealth || players[1].gateHealth}
                id={socketPlayers[1]?.id || 1}
              />
              <Castle
                player="Player 1"
                castleHealth={socketPlayers[0].gameData.castleHealth}
                gateHealth={socketPlayers[0].gameData.gateHealth}
              />
              <Castle
                player="Player 2"
                castleHealth={socketPlayers[1]?.gameData.castleHealth || players[1].castleHealth}
                gateHealth={socketPlayers[1]?.gameData.gateHealth || players[1].gateHealth}
              />
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
  cursor: pointer;
  transition: all 0.2s;
  ${({ disabled }) =>
    disabled
      ? css`
          background-color: var(--color-hp);
          cursor: not-allowed;
        `
      : css`
          background-color: var(--castle-red);
        `}

  :hover {
    transform: translateY(-3px) scale(1.1);
  }
`;

export const RoomNameInput = styled.input`
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
  text-align: center;

  :hover {
    transform: translateY(-3px) scale(1.1);
  }

  ::placeholder {
    color: var(--color-white);
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

export const RoomLabel = styled.p`
  position: fixed;
  display: inline-block;
  left: 50%;
  top: 13.5rem;
  transform: translateX(-50%);
`;

export default Battlefield;
