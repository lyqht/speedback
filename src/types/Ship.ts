import { Database } from './DatabaseDefinitions';
import { CrewMember } from './CrewMember';
import { UserMetadata } from './UserMetadata';

export type Ship = Database['public']['Tables']['Ship']['Row'] & {
  crew: CrewMember[];
};

export type CrewMetadata = UserMetadata & { ready: boolean };

export interface ShipWithMetadata extends Omit<Ship, 'crew' | 'captain'> {
  crew: CrewMetadata[];
  captain: UserMetadata;
}
