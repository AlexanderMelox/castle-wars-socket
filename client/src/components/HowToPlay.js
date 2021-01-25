import React from 'react';
import styled from 'styled-components';

const HowToPlay = () => {
  return (
    <HowToPlayContainer>
      <h2>How to play</h2>
      <p>Whoever get's their castle to 100HP or their enemies castle to 0HP wins!</p>
      <p>
        Builders, Soldiers and Magic determines to amount of resources you get per turn. The more you hire the more
        resources you get on your turn!
      </p>
      <p>Skipping your turn allows you to save up on resources</p>
    </HowToPlayContainer>
  );
};

const HowToPlayContainer = styled.div`
  transform: translateY(5rem);
  font-family: 'Helvetica Neue', sans-serif;

  h2 {
    padding: 1rem 0;
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
  }
  p {
    margin-top: 1rem;
    font-size: 1.6rem;
  }
`;

export default HowToPlay;
