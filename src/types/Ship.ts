import { Database } from './DatabaseDefinitions';
import { CrewMember } from './CrewMember';

export type Ship = Database['public']['Tables']['Ship']['Row'] & {
  crew: CrewMember[];
};
