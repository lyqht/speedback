import type { Database } from '@/types/DatabaseDefinitions';
import { faker } from '@faker-js/faker';
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 } from 'uuid';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ``;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ``;
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

const createShipAndSchedule = async ({
  captain,
  ship,
}: {
  captain: string;
  ship: string;
}) => {
  const { data: createdShip, error: createShipError } = await supabase
    .from('Ship')
    .insert({
      captain,
      name: ship,
      id: v4(),
      crew: [],
      code: faker.random.alphaNumeric(5), // TODO: address code collision in DB
    })
    .select();

  if (createShipError) {
    throw new Error(JSON.stringify(createShipError));
  }

  const { data: createdSchedule, error: createScheduleError } = await supabase
    .from('Schedule')
    .insert([{ shipId: createdShip[0].id }])
    .select();

  if (createScheduleError) {
    throw new Error(JSON.stringify(createScheduleError));
  }

  return {
    createdShip,
    createdSchedule,
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    console.log(req.body);
    const { captain, ship } = req.body;
    if (!captain || !ship) {
      return res.status(400).json('Nope');
    }

    try {
      const response = await createShipAndSchedule({
        captain,
        ship,
      });

      return res.status(200).json({
        captain: response.createdShip[0].captain,
        name: response.createdShip[0].name,
        id: response.createdShip[0].id,
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json(err);
    }
  } else if (req.method === 'GET') {
    const { id } = req.query;
    const { data, error } = await supabase.from('Ship').select().eq('id', id);
    if (error) {
      return res.status(400).json(error);
    }

    return res.status(200).json(data);
  }

  return res.status(500);
}
