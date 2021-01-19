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

export const resourceColorMap = {
  bricks: `var(--color-building)`,
  weapons: `var(--color-weapons)`,
  magic: `var(--color-magic)`,
  crystals: `var(--color-magic)`,
  hp: `var(--color-hp)`,
};
