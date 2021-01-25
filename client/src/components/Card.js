import React, { useMemo, useContext } from 'react';
import styled from 'styled-components';
import icons from '../assets/cardIcons';
import { resourceColorMap } from '../utils';
import { CardsContext } from './battlefield';

const Card = ({ card, resources }) => {
  const { onCardClick } = useContext(CardsContext);
  const cantUse = useMemo(() => card.cost > resources, [resources, card.cost]);
  const isCrushType = useMemo(() => card.name.includes('crush'), [card.name]);

  const cardName = useMemo(() => {
    if (card.name.includes('crush')) {
      let [, type] = card.name.split('crush');
      return `crush ${type}`;
    } else if (card.name.includes('conjure')) {
      let [, type] = card.name.split('conjure');
      return `conjure ${type}`;
    } else {
      return card.name;
    }
  }, [card.name]);

  return (
    <StyledCard onClick={() => onCardClick(card)} $type={card.type} $cantUse={cantUse}>
      <ResourceType src={icons[card.type]} />
      <Cost>{card.cost}</Cost>
      <Body>
        <Name>{cardName}</Name>
        <Icon src={icons[card.name]} $isCrushType={isCrushType} />
        <Description dangerouslySetInnerHTML={{ __html: card.description }} />
      </Body>
    </StyledCard>
  );
};

export const StyledCard = styled.div`
  height: 90%;
  border-radius: 0.5rem;
  width: 15rem;
  margin: 1rem;
  text-align: center;
  position: relative;
  z-index: 9000 !important;
  box-shadow: var(--text-shadow);
  transition: all 0.2s;
  max-height: 18.5rem;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
  }

  &:active {
    transform: translateY(-1px);
  }

  background-color: ${({ $type }) => resourceColorMap[$type]};
  filter: ${({ $cantUse }) => ($cantUse ? 'grayscale(100%) brightness(0.4)' : 'none')};
`;

export const ResourceType = styled.img`
  position: absolute;
  top: 1rem;
  width: 2rem;
  left: 1rem;
`;

export const Cost = styled.div`
  position: absolute;
  top: 1rem;
  font-size: 2rem;
  right: 1rem;
`;

export const Body = styled.div`
  display: flex;
  padding: 1.5rem;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  height: 100%;
`;

export const Name = styled.p`
  color: var(--color-white);
  font-size: 2rem;
`;

const Icon = styled.img`
  width: 6rem;
  filter: ${({ $isCrushType }) =>
    $isCrushType
      ? `grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)`
      : 'none'};
`;

const Description = styled.p`
  font-size: 1.3rem;
`;

export default Card;
