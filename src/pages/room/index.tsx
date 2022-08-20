import { baseUrl } from '@/Config';
import { Room } from '@/services/RoomService';
import { DailyCall } from '@daily-co/daily-js';
import { getUser } from '@supabase/auth-helpers-nextjs';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import AssignedCall from '../../components/AssignedCall';
import { Schedule } from '../../types/Schedule';

export function Room({ room, expiry }: Room) {
  const [callFrame, setCallFrame] = useState<DailyCall | null>(null);

  return (
    <div className="w-full h-full flex items-center justify-center">
      {room ? (
        <AssignedCall
          room={room}
          expiry={expiry}
          setCallFrame={setCallFrame}
          callFrame={callFrame}
        />
      ) : (
        <div>
          <p>You are not assigned to a room for now.</p>
          <p>In the mean time, sit back and relax. Take a break.</p>
        </div>
      )}
    </div>
  );
}

export default Room;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await fetch(
    `${baseUrl}/api/schedule?id=${context.query.scheduleId}`,
  );
  const schedule: Schedule = await response.json();

  const { user } = await getUser(context);
  const pairIndex = schedule.sequence[0].findIndex(
    (pair) => pair.user1 === user.id || pair.user2 === user.id,
  );

  if (pairIndex === -1) {
    console.error(`Cannot find current user in schedule`);
    return {
      props: {},
    };
  }
  const assignedRoom = schedule.rooms![pairIndex];

  return {
    props: {
      room: assignedRoom.room,
      expiry: assignedRoom.expiry,
      id: assignedRoom.id,
    },
  };
};
