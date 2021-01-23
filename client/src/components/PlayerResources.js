import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { resourceColorMap } from '../utils';
// import usePreviousState from '../hooks/usePreviousState';

import cardIcons from '../assets/cardIcons';

const startingUpdated = {
  builders: '',
  bricks: '',
  soldiers: '',
  weapons: '',
  magic: '',
  crystals: '',
  castleHealth: '',
  gateHealth: '',
};

const PlayerResources = ({ player, isActivePlayer, resources, castleHealth, gateHealth, id }) => {
  const [updated] = useState(startingUpdated);
  // stores the previous resources to know which one changed to show in the ui
  // const prevResources = usePreviousState(resources);

  // const resetUpdates = () => setUpdated(startingUpdated);

  // TODO: need to add updating steps and timeouts

  return (
    <Resources $isPlayerOne={id === 0} $isActivePlayer={isActivePlayer}>
      <Player $isActivePlayer={isActivePlayer}>{player}</Player>
      <ResourceBlock $type="bricks">
        <ResourceDetails>
          <ResourceIcon src={cardIcons['builders']} />
          <ResourceType>Builders</ResourceType>
          {updated.builders !== '' && <ResourceUpdates>{updated.builders}</ResourceUpdates>}
          <div>{resources.builders}</div>
        </ResourceDetails>
        <ResourceDetails>
          <ResourceIcon src={cardIcons['bricks']} />
          <ResourceType>Bricks</ResourceType>
          {updated.bricks !== '' && <ResourceUpdates>{updated.bricks}</ResourceUpdates>}
          <div>{resources.bricks}</div>
        </ResourceDetails>
      </ResourceBlock>
      <ResourceBlock $type="weapons">
        <ResourceDetails>
          <ResourceIcon src={cardIcons['soldiers']} />
          <ResourceType>Soldiers</ResourceType>
          {updated.soldiers !== '' && <ResourceUpdates>{updated.soldiers}</ResourceUpdates>}
          <div>{resources.soldiers}</div>
        </ResourceDetails>
        <ResourceDetails>
          <ResourceIcon src={cardIcons['weapons']} />
          <ResourceType>Weapons</ResourceType>
          {updated.weapons !== '' && <ResourceUpdates>{updated.weapons}</ResourceUpdates>}
          <div>{resources.weapons}</div>
        </ResourceDetails>
      </ResourceBlock>
      <ResourceBlock $type="magic">
        <ResourceDetails>
          <ResourceIcon src={cardIcons['magic']} />
          <ResourceType>Magic</ResourceType>
          {updated.magic !== '' && <ResourceUpdates>{updated.magic}</ResourceUpdates>}
          <div>{resources.magic}</div>
        </ResourceDetails>
        <ResourceDetails>
          <ResourceIcon src={cardIcons['crystals']} />
          <ResourceType>crystals</ResourceType>
          {updated.crystals !== '' && <ResourceUpdates>{updated.crystals}</ResourceUpdates>}
          <div>{resources.crystals}</div>
        </ResourceDetails>
      </ResourceBlock>
      <ResourceBlock $type="hp">
        <ResourceDetails>
          <ResourceIcon src={cardIcons['castle']} />
          <ResourceType>Castle</ResourceType>
          {updated.castleHealth !== '' && <ResourceUpdates>{updated.castleHealth}</ResourceUpdates>}
          <div>{castleHealth}</div>
        </ResourceDetails>
        <ResourceDetails>
          <ResourceIcon src={cardIcons['gate']} />
          <ResourceType>Gate</ResourceType>
          {updated.gateHealth !== '' && <ResourceUpdates>{updated.gate}</ResourceUpdates>}
          <div>{gateHealth}</div>
        </ResourceDetails>
      </ResourceBlock>
    </Resources>
  );
};

export const Resources = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: fixed;
  top: 1rem;
  ${({ $isPlayerOne }) => ($isPlayerOne ? `left: 1rem` : `right: 1rem`)};
  border-radius: 2rem;
  padding: 2rem;
  width: 30rem;
  z-index: 5000;
  opacity: ${({ $isActivePlayer }) => ($isActivePlayer ? 1 : 0.5)};
  transform: ${({ $isActivePlayer }) => ($isActivePlayer ? 'scale(1)' : 'scale(0.9)')};
`;

export const Player = styled.h2`
  color: ${({ $isActivePlayer }) => ($isActivePlayer ? 'var(--color-white)' : 'rgba(255, 255, 255, 0.2)')};
  font-size: 3rem;
  text-shadow: var(--text-shadow--small);
  display: inline-block;
  margin: 0 auto;
  margin-bottom: 2rem;
  transition: all 0.2s;

  ${({ $isActivePlayer }) =>
    $isActivePlayer &&
    `
    letter-spacing: 3px;
    transform: scale(1.1);
    border-bottom: 3px solid red;`};
`;

export const ResourceBlock = styled.div`
  align-self: stretch;
  border-radius: 1.5rem;
  padding: 1rem;
  color: var(--color-white);
  box-shadow: var(--text-shadow);
  border: 3px solid rgba(0, 0, 0, 0.2);
  font-size: 2rem;
  background-color: ${({ $type }) => resourceColorMap[$type]};

  &:not(:last-child) {
    margin-bottom: 2rem;
  }
`;

export const ResourceDetails = styled.div`
  display: flex;
  padding: 1rem;
  align-items: center;
  justify-content: flex-start;

  &:first-child {
    border-bottom: 3px solid rgba(0, 0, 0, 0.1);
  }
`;

export const ResourceIcon = styled.img`
  height: 3rem;
  margin-right: 1rem;
`;

export const ResourceType = styled.div`
  margin-right: auto;
`;

export const ResourceUpdates = styled.div`
  padding: 0.5rem;
  margin-right: 1rem;
  color: #fff;
  background-color: var(--castle-red);
  font-size: 1.6rem;
  border-radius: 0.5rem;
  line-height: 1;
`;

export default PlayerResources;
