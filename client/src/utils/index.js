import cards from '../assets/cards';

// Gets a random card from the deck
export const newCard = () => cards[Math.floor(Math.random() * cards.length)];

// Create a hand for a player
export const createHand = () => {
  const newHand = [];
  for (let i = 0; i < 8; i++) {
    newHand.push(newCard());
  }
  return newHand;
};

export const getResourcesArray = () => {
  return ['bricks', 'weapons', 'crystals'];
};

export const getOpponent = (activePlayer) => {
  const opponent = activePlayer === 0 ? 1 : 0;
  return opponent;
};

export const initResources = () => {
  return {
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
  };
};

export const resourceColorMap = {
  bricks: `var(--color-building)`,
  weapons: `var(--color-weapons)`,
  magic: `var(--color-magic)`,
  crystals: `var(--color-magic)`,
  hp: `var(--color-hp)`,
};
