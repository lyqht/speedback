import { supabase } from './../auth/[...supabase]';
import { NextApiRequest, NextApiResponse } from 'next';
import { Schedule, PairingRoundSequence } from '../../../types/Schedule';
import { Room } from '../../../services/RoomService';

const setExistingSchedulesInactive = async (shipId: string) => {
  const { data, error } = await supabase
    .from<Schedule>(`Schedule`)
    .update({
      active: false,
    })
    .eq(`shipId`, shipId);

  if (error) {
    console.warn(error);
  }

  console.log(`Set schedules inactive: ` + JSON.stringify(data));
};

const addSchedule = async (
  shipId: string,
  sequence: PairingRoundSequence,
  rooms: Room[],
) => {
  const { data, error } = await supabase.from<Schedule>(`Schedule`).insert({
    shipId,
    sequence,
    rooms,
    active: true,
  });

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  return data;
};

const getActiveSchedule = async (scheduleId: string) => {
  const { data, error } = await supabase
    .from<Schedule>(`Schedule`)
    .select()
    .eq(`id`, scheduleId)
    .eq(`active`, true);

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
    const { shipId, sequence, rooms } = req.body;
    if (!shipId || !sequence || !rooms) {
      return res.status(400).json(`Nope`);
    }

    try {
      await setExistingSchedulesInactive(shipId);
      const data = await addSchedule(shipId, sequence, rooms);
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(400).json(`Error creating new schedule`);
    }
  } else if (req.method === `GET`) {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json(`Nope`);
    }

    try {
      const data = await getActiveSchedule(id as string);
      return res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res
        .status(400)
        .json(
          `Error retrieving schedule for this user, this user might not been part of the ship when the session started.`,
        );
    }
  }

  return res.status(500);
}
