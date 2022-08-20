import { baseUrl } from '@/Config';
import { createRoom } from '@/services/RoomService';
import { CrewMember } from '@/types/CrewMember';
import { Schedule } from '@/types/Schedule';
import { Ship } from '@/types/Ship';
import { getUser, supabaseClient, User } from '@supabase/auth-helpers-nextjs';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import AvatarWithStatus from '../../components/AvatarWithStatus';
import Clipboard from '../../components/Clipboard';
import { generatePairingRoundSequence } from '../../helpers/schedule-generator';
import { Room } from '../../services/RoomService';

interface Props {
  ship: Ship;
  user: User;
  ready?: boolean;
}

const setReadyStatus = async (userId: string, shipId: string) => {
  await fetch(`/api/ship/${shipId}`, {
    method: `POST`,
    body: JSON.stringify({ userId, shipId }),
    headers: {
      'Content-Type': `application/json`,
    },
  });
};

const startSpeedbackSession = async (playerIds: string[], shipId: string) => {
  const sequence = generatePairingRoundSequence(playerIds);
  const roomsToCreate: Promise<Room>[] = [];
  try {
    sequence.forEach(() => {
      roomsToCreate.push(createRoom());
    });
    const rooms = await Promise.all(roomsToCreate);

    await fetch(`/api/schedule`, {
      method: `POST`,
      body: JSON.stringify({ sequence, shipId, rooms }),
      headers: {
        'Content-Type': `application/json`,
      },
    });
  } catch (err) {
    console.error(JSON.stringify(err));
  }
};

const addRealtimeNotification = (newContent: string) => {
  const newElement = document.createElement(`p`);
  newElement.appendChild(document.createTextNode(newContent));

  const notificationsCorner = document.getElementById(`realtime-notifications`);
  notificationsCorner?.appendChild(newElement);

  setTimeout(() => {
    notificationsCorner?.removeChild(newElement);
  }, 1200);
};

export default function ShipWaitingHall({ ship, user, ready = false }: Props) {
  // this causes the alert to show up when Next.js auto-refresh from server
  // useLeavePageConfirm(true);

  const [currentCrew, setCurrentCrew] = useState<CrewMember[]>(ship.crew);

  useEffect(() => {
    // subscriber for ready checks
    const readySubscriber = supabaseClient
      .from(`Ship:id=eq.${ship.id}`)
      .on(`UPDATE`, (payload) => {
        setCurrentCrew(payload.new.crew);
      })
      .subscribe();

    const scheduleSubscriber = supabaseClient
      .from(`Schedule:shipId=eq.${ship.id}`)
      .on(`INSERT`, (payload) => {
        console.log(`New schedule added`);
        console.log(payload.new);
        const insertedSchedule: Schedule = payload.new;
        Router.push(`/room?scheduleId=${insertedSchedule.id}`);
      })
      .subscribe();

    return () => {
      readySubscriber.unsubscribe();
      scheduleSubscriber.unsubscribe();
    };
  }, []);

  const isCaptain = ship.captain === user.id;
  const allCrewIsReady =
    currentCrew.length > 0 &&
    currentCrew.filter((member: CrewMember) => member.ready === true).length ===
      currentCrew.length;

  const crewActionButtonColor = ready ? `bg-red-400` : `bg-green-400`;

  return (
    <div className="h-full">
      <h1>{ship.name}</h1>
      <p>Host: {ship.captain}</p>
      {ship.code && (
        <Clipboard value={ship.code} fieldToBeCopied={`room code`} />
      )}
      <div id="participant-list">
        <p>Crew joined: {currentCrew.length ?? 0}</p>
        <AvatarWithStatus.Captain name={ship.captain} />

        {currentCrew
          ? currentCrew?.map((crewMember: CrewMember) => (
              <AvatarWithStatus.Crew
                key={crewMember.userId}
                name={crewMember.userId}
                ready={crewMember.ready}
              />
            ))
          : null}
      </div>
      <div
        id="player-options"
        className="flex flex-row justify-end align-items-end p-4 m-4"
      >
        {!isCaptain ? (
          <>
            <button
              className={`${crewActionButtonColor} transition-colors p-4 shadow-sm border text-white rounded-lg`}
              onClick={async () => {
                await setReadyStatus(user.id, ship.id);
              }}
            >
              Ready
            </button>
          </>
        ) : (
          <>
            <button
              disabled={!allCrewIsReady}
              className={`${
                allCrewIsReady ? `bg-green-400` : `bg-gray-400`
              } hover:shadow-lg transition-colors p-4 shadow-sm border text-white rounded-lg`}
              onClick={() => {
                startSpeedbackSession(
                  [...currentCrew.map((member) => member.userId), ship.captain],
                  ship.id,
                );
              }}
            >
              Start New Voyage
            </button>
          </>
        )}
      </div>
      <div
        id="realtime-notifications"
        className="border-solid border-4 border-blue-400 bg-slate-400 h-1/3 w-1/3"
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ship: Ship = await (
    await fetch(`${baseUrl}/api/ship?id=${context.query.id}`)
  ).json();
  const crew: CrewMember[] = ship.crew;

  const { user } = await getUser(context);
  const ready =
    crew.find((member) => member.userId === user.id)?.ready ?? false;

  return {
    props: { ship, user, ready },
  };
};
