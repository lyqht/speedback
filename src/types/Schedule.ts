import { Database } from './DatabaseDefinitions';

export type ScheduleStatus = 'active' | 'inactive';
export type SchedulePairing = {
  user1: string;
  user2: string;
};

export type PairingRound = SchedulePairing[];
export type PairingRoundSequence = PairingRound[];

export type Schedule = Database['public']['Tables']['Schedule']['Row'] & {
  sequence: PairingRoundSequence;
};
