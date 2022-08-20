import { Json } from './../types/DatabaseDefinitions';

export type Room = Json & {
  id: string;
  expiry: number;
  room: string;
};

export const createRoom = async (): Promise<Room> => {
  try {
    const res = await fetch(`/api/room`, {
      method: `POST`,
      headers: {
        'Content-Type': `application/json`,
      },
    });
    const result = await res.json();
    return {
      id: result.id,
      expiry: result.config?.exp,
      room: result.url,
    };
  } catch (e) {
    console.error(e);
    throw new Error(JSON.stringify(e));
  }
};
