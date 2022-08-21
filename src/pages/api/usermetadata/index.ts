import { ShipWithMetadata } from '@/types/Ship';
import type { NextApiRequest, NextApiResponse } from 'next';
import { CrewMember } from '../../../types/CrewMember';
import { UserMetadata } from '../../../types/UserMetadata';
import { supabase } from '../auth/[...supabase]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === `POST`) {
    const { shipId, captainId, crew } = req.body;

    if (!shipId || !captainId || !crew) {
      return res.status(400).json(`nope`);
    }

    const { data: allPlayersMetadata, error: metadataError } = await supabase
      .from<UserMetadata>(`UserMetadata`)
      .select()
      .eq(`shipId`, shipId as string);

    if (metadataError) {
      console.error(JSON.stringify(metadataError));
      res.status(400).json(`Cannot find metadata for crew`);
    }

    if (allPlayersMetadata && allPlayersMetadata.length > 1) {
      const captainMetadataIndex = allPlayersMetadata.findIndex(
        (metadata) => metadata.userId === captainId,
      );
      const captainMetadata = allPlayersMetadata[captainMetadataIndex];
      allPlayersMetadata!.splice(captainMetadataIndex, 1);
      const crewMetadataWithStatus = allPlayersMetadata.map((metadata) => ({
        ...metadata,
        ready: crew.find(
          (member: CrewMember) => member.userId === metadata.userId,
        )?.ready,
      }));

      const playersMetadata = {
        captain: {
          ...captainMetadata,
        },
        crew: [...crewMetadataWithStatus],
      } as ShipWithMetadata;

      return res.status(200).json(playersMetadata);
    } else {
      return res.status(400).json(`Cannot find metadata for crew`);
    }
  }

  return res.status(500);
}
