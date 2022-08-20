import { CrewMember } from '@/types/CrewMember';
import { Ship } from '@/types/Ship';
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../auth/[...supabase]';

const setReadyStatus = async (userId: string, shipId: string) => {
  const { data: ships, error: getShipError } = await supabase
    .from<Ship>(`Ship`)
    .select()
    .eq(`id`, shipId)
    .select();

  if (getShipError) {
    throw new Error(JSON.stringify(getShipError));
  }

  const foundShip = ships[0];
  const currentCrew: CrewMember[] = foundShip.crew;
  const currentCrewIndex = currentCrew.findIndex(
    (member) => member.userId === userId,
  );

  if (currentCrewIndex === -1) {
    throw new Error(
      `This member cannot be found in Ship ${foundShip.name}, cannot set ready status.`,
    );
  }

  const updatedCrew = [...currentCrew];
  const foundMember: CrewMember = currentCrew[currentCrewIndex];
  foundMember.ready = !foundMember.ready;
  updatedCrew[currentCrewIndex] = foundMember;

  const { data, error } = await supabase
    .from(`Ship`)
    .update({
      crew: updatedCrew,
    })
    .eq(`id`, shipId)
    .select();

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  return data[0];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === `POST`) {
    const { userId, shipId } = req.body;

    try {
      const updatedShip = await setReadyStatus(userId, shipId);
      return res.status(200).json(updatedShip);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  return res.status(500);
}
