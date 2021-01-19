import React, { useMemo } from 'react';
import styled from 'styled-components/macro';

const Castle = ({ player, castleHealth, gateHealth }) => {
  const castleHeight = useMemo(() => castleHealth * 1.1, [castleHealth]);
  const gateHeight = useMemo(() => gateHealth * 1.1, [gateHealth]);

  return (
    <CastleContainer>
      <CastleBody $height={castleHeight} $isPlayerOne={player === 'Player 1'} />
      <Gate $height={gateHeight} $isPlayerOne={player === 'Player 1'} />
    </CastleContainer>
  );
};

export const CastleContainer = styled.div``;

export const CastleBody = styled.div`
  position: absolute;
  transition: height 1s;
  bottom: 0;
  width: 20rem;
  height: 100rem;
  border: 3px solid rgba(0, 0, 0, 0.4);
  box-shadow: var(--text-shadow);
  height: ${({ $height }) => $height + '%'};
  background-color: ${({ $isPlayerOne }) => ($isPlayerOne ? 'var(--castle-blue)' : 'var(--castle-red)')};
  ${({ $isPlayerOne }) => ($isPlayerOne ? `left: 40rem` : `right: 40rem`)};

  &::before {
    display: block;
    position: absolute;
    content: '';
    width: 4rem;
    top: -4rem;
    left: -1rem;
    height: 200rem;
    border: 3px solid rgba(0, 0, 0, 0.4);

    background-color: ${({ $isPlayerOne }) => ($isPlayerOne ? 'var(--castle-blue)' : 'var(--castle-red)')};
  }

  &::after {
    display: block;
    position: absolute;
    content: '';
    width: 4rem;
    top: -4rem;
    right: -1rem;
    height: 200rem;
    box-shadow: var(--text-shadow);
    border: 3px solid rgba(0, 0, 0, 0.4);
    background-color: ${({ $isPlayerOne }) => ($isPlayerOne ? 'var(--castle-blue)' : 'var(--castle-red)')};
  }
`;

export const Gate = styled.div`
  position: absolute;
  width: 2rem;
  height: ${({ $height }) => $height + '%'};
  bottom: 0;
  border: 3px solid rgba(0, 0, 0, 0.4);
  transition: height 1s;

  background-color: ${({ $isPlayerOne }) => ($isPlayerOne ? 'var(--castle-blue)' : 'var(--castle-red)')};
  ${({ $isPlayerOne }) => ($isPlayerOne ? `left: 65rem` : `right: 65rem`)};

  &::before {
    content: '';
    display: block;
    width: 3rem;
    height: 1rem;
    position: absolute;
    top: -1rem;
    left: -0.8rem;
    background-color: #fff;
    border: 3px solid rgba(0, 0, 0, 0.4);
  }
`;

export default Castle;
