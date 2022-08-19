import { Json } from './DatabaseDefinitions';

export type CrewMember = Json & {
  ready: boolean;
  userId: string;
};
