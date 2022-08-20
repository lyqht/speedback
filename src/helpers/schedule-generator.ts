import { PairingRoundSequence } from '@/types/Schedule';
import { PairingRound } from '../types/Schedule';

const shuffleArray = (array: string[]) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// simple algorithm to shuffle players and assign to a round robin schedule
export const generatePairingRoundSequence = (
  playerIds: string[],
): PairingRoundSequence => {
  const numberOfRounds = playerIds.length - 1;
  const shuffledPlayerIds = shuffleArray(playerIds);
  const pairings: PairingRoundSequence = [];
  for (let i = 0; i < numberOfRounds; i++) {
    const currentRoundPairings: PairingRound = [];
    for (let j = 0; j < shuffledPlayerIds.length / 2; j++) {
      const user1 = shuffledPlayerIds[j];
      const user2 = shuffledPlayerIds[shuffledPlayerIds.length - 1 - j];

      if (user1 !== user2) {
        currentRoundPairings.push({
          user1,
          user2,
        });
      }
    }

    pairings.push(currentRoundPairings);

    shuffledPlayerIds.splice(
      1,
      0,
      shuffledPlayerIds[shuffledPlayerIds.length - 1],
    );
    shuffledPlayerIds.pop();
  }
  return pairings;
};
