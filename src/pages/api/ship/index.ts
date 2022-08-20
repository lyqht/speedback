import { faker } from '@faker-js/faker';
import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 } from 'uuid';
import { supabase } from '../auth/[...supabase]';

const createShip = async ({
  captain,
  ship,
}: {
  captain: string;
  ship: string;
}) => {
  const { data: createdShips, error: createShipError } = await supabase
    .from(`Ship`)
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

  return createdShips[0];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === `POST`) {
    const { captain, ship } = req.body;
    if (!captain || !ship) {
      return res.status(400).json(`Nope`);
    }

    try {
      const createdShip = await createShip({
        captain,
        ship,
      });

      return res.status(200).json({
        captain: createdShip.captain,
        name: createdShip.name,
        id: createdShip.id,
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json(err);
    }
  } else if (req.method === `GET`) {
    const { id } = req.query;
    const { data, error } = await supabase.from(`Ship`).select().eq(`id`, id);
    if (error) {
      return res.status(400).json(error);
    }

    if (data.length === 0) {
      return res.status(404).json(`Ship not found`);
    }

    return res.status(200).json(data[0]);
  }

  return res.status(500);
}
