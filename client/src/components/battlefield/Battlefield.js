import React, { useEffect, useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import PlayerResources from '../PlayerResources';
import Castle from '../Castle';

import cards from '../../assets/cards';
import buildSocketUrl from '../../utils/buildSocketUrl';

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
  const [socketPlayers, setSocketPlayers] = useState([]);
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

  const [roomname, setRoomname] = useState('');
  const [username, setUsername] = useState('');
  const socket = useRef(null);

  const startGame = () => {
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && socket) {
      try {
        let socket = buildSocketUrl();
        socket.addEventListener('open', () => {
          console.log("SOCKET CONNECTION SUCCESSFUL");
          console.log(socketPlayers && socketPlayers.length ? 1 : 0);
          socket.send(JSON.stringify({
            name: username,
            roomId: roomname,
            gameData: socketPlayers && socketPlayers.length === 2 ? players[1] : players[0],
            id: socketPlayers && socketPlayers.length === 2 ? 1 : 0
          }));
        });
        socket.onmessage = message => {
          console.log(message);
          console.log(message.data);
          console.log(JSON.parse(message.data));
          const socketUsers = JSON.parse(message.data).users ? JSON.parse(message.data).users : [JSON.parse(message.data)];
          console.log('new players: ', socketUsers.length);
          console.log('existing players: ', socketPlayers.length);
          // if users.length is 1 replace the first
          // item in `players` and leave the second object

          // if users.length is 2 replace the entire `players`
          // array that is returned
          if (socketUsers && socketUsers.length) {
            const clone = [...socketPlayers];
            console.log([clone.flat(), socketUsers].flat());
            setSocketPlayers(socketUsers);
          }

          // then this is the end of setting up the game
          // there should be a new useEffect to update each players
          // game data after each turn
        }
        socket.addEventListener('close', () => {
          console.log('DISCONNECTED');
          // remove the user that disconnected
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [socket, username, roomname, isPlaying, players]);

  console.log({players});
  console.log({socketPlayers});

  return (
    <BattlefieldContainer>
      {!isPlaying && (
        <BattlefieldMenu>
          <RoomNameInput
            placeholder="Enter username"
            type="text"
            value={username}
            onChange={event => setUsername(event.target.value)}
          />
          <RoomNameInput
            placeholder="Enter room name"
            type="text"
            value={roomname}
            onChange={event => setRoomname(event.target.value)}
          />
          <BattlefieldButtons disabled={!username.length || !roomname.length} onClick={startGame}>Play</BattlefieldButtons>
          <BattlefieldButtons>How to Play</BattlefieldButtons>
        </BattlefieldMenu>
      )}
      <BattlefieldTop>
        {isPlaying && (socketPlayers && socketPlayers.length) && (
          <>
            {socketPlayers && socketPlayers.length && (
              <RoomLabel>Room: {socketPlayers[0].roomId}</RoomLabel>
            )}
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
            <Castle player="Player 1" castleHealth={socketPlayers[0].gameData.castleHealth} gateHealth={socketPlayers[0].gameData.gateHealth} />
            <Castle player="Player 2" castleHealth={socketPlayers[1]?.gameData.castleHealth || players[1].castleHealth} gateHealth={socketPlayers[1]?.gameData.gateHealth || players[1].gateHealth} />
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
  cursor: pointer;
  transition: all 0.2s;
  ${({ disabled }) => disabled
    ? css`
      background-color: var(--color-hp);
      cursor: not-allowed;
    `
    : css`
      background-color: var(--castle-red);
    `
  }

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
