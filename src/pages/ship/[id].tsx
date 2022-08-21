import { baseUrl } from '@/Config';
import GeneralLayout from '@/layouts/GeneralLayout';
import { createRoom } from '@/services/RoomService';
import { CrewMember } from '@/types/CrewMember';
import { Schedule } from '@/types/Schedule';
import { CrewMetadata, Ship } from '@/types/Ship';
import { getUser, supabaseClient, User } from '@supabase/auth-helpers-nextjs';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import AvatarWithStatus from '../../components/AvatarWithStatus';
import Clipboard from '../../components/Clipboard';
import { generatePairingRoundSequence } from '../../helpers/schedule-generator';
import { Room } from '../../services/RoomService';
import { ShipWithMetadata } from '../../types/Ship';

interface Props {
  ship: ShipWithMetadata;
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

const getPlayerMetadata = async (
  shipId: string,
  captainId: string,
  crew: CrewMember[] | CrewMetadata[],
) => {
  const result = await fetch(`${baseUrl}/api/usermetadata`, {
    method: `POST`,
    headers: {
      'Content-Type': `application/json`,
    },
    body: JSON.stringify({
      shipId,
      captainId,
      crew,
    }),
  });
  return result.json();
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

export default function ShipWaitingHall({ ship, user }: Props) {
  // this causes the alert to show up when Next.js auto-refresh from server
  // useLeavePageConfirm(true);

  const [currentCrew, setCurrentCrew] = useState<CrewMetadata[]>(ship.crew);
  const ready =
    currentCrew.find((member) => member.userId === user.id)?.ready ?? false;

  useEffect(() => {
    const shipSubscriber = supabaseClient
      .from(`Ship:id=eq.${ship.id}`)
      .on(`UPDATE`, async (payload) => {
        const updatedCrewListWithReadyStatus = payload.new.crew;
        const playerMetadata = await getPlayerMetadata(
          ship.id,
          ship.captain.userId,
          updatedCrewListWithReadyStatus,
        );
        setCurrentCrew(
          playerMetadata.crew.map((member: CrewMetadata) => ({
            ...member,
            ready: updatedCrewListWithReadyStatus.find(
              (memberWithReadyStatus: CrewMember) =>
                member.userId === memberWithReadyStatus.userId,
            )?.ready,
          })),
        );
      })
      .subscribe();

    const scheduleSubscriber = supabaseClient
      .from(`Schedule:shipId=eq.${ship.id}`)
      .on(`INSERT`, (payload) => {
        const insertedSchedule: Schedule = payload.new;
        Router.push(`/room?scheduleId=${insertedSchedule.id}`);
      })
      .subscribe();

    return () => {
      shipSubscriber.unsubscribe();
      scheduleSubscriber.unsubscribe();
    };
  }, []);

  const isCaptain = ship.captain.userId === user.id;
  const readyCrew = currentCrew.filter(
    (member: CrewMember) => member.ready === true,
  );

  const allCrewIsReady =
    currentCrew.length > 0 && readyCrew.length === currentCrew.length;

  return (
    <GeneralLayout>
      <div className="z-10 h-full w-full flex-grow flex-col items-center justify-between gap-4 p-8">
        <div id="waiting-hall-content" className="h-4/5">
          <div className="flex flex-row items-center gap-4">
            <p className="font-dynapuff text-3xl">⚓️ {ship.name}</p>
            {ship.code && (
              <Clipboard value={ship.code} fieldToBeCopied={`code`} />
            )}
          </div>
          <div
            id="divider"
            className="my-4 mb-4 w-full border-b-4 border-b-blue-400 lg:w-1/2"
          />
          <div className="flex w-full flex-col items-start">
            <p className="mb-4 text-2xl italic">
              Crew on the ship ({currentCrew.length + 1})
            </p>
          </div>
          <div
            id="participant-list"
            className="flex h-full flex-col items-start gap-4 overflow-y-auto"
          >
            <AvatarWithStatus.Captain name={ship.captain.nickname!} />
            {currentCrew
              ? currentCrew?.map((crewMember: CrewMetadata) => (
                  <AvatarWithStatus.Crew
                    key={crewMember.userId}
                    name={crewMember.nickname!}
                    ready={crewMember.ready}
                  />
                ))
              : null}
          </div>
        </div>
        <div
          id="player-options"
          className="align-items-end m-4 flex flex-row justify-end p-4"
        >
          {!isCaptain ? (
            <>
              <button
                className={`${
                  ready ? `bg-gray-500` : `bg-blue-700`
                } rounded-lg border p-4 text-white shadow-sm transition-colors hover:bg-blue-400`}
                onClick={async () => {
                  await setReadyStatus(user.id, ship.id);
                }}
              >
                Ready
              </button>
            </>
          ) : (
            <>
              <div>
                <p>
                  {readyCrew.length} / {currentCrew.length} ready
                </p>
                <button
                  disabled={!allCrewIsReady}
                  className={`${
                    allCrewIsReady ? `bg-green-400` : `bg-gray-400`
                  } rounded-lg border p-4 text-white shadow-sm transition-colors hover:shadow-lg`}
                  onClick={() => {
                    startSpeedbackSession(
                      [
                        ...currentCrew.map((member) => member.userId),
                        ship.captain.userId,
                      ],
                      ship.id,
                    );
                  }}
                >
                  Start New Voyage
                </button>
              </div>
            </>
          )}
        </div>
        {/* <div
          id="realtime-notifications"
          className="h-1/3 w-1/3 border-4 border-solid border-blue-400 bg-slate-400"
        /> */}
      </div>
    </GeneralLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ship: Ship = await (
    await fetch(`${baseUrl}/api/ship?id=${context.query.id}`)
  ).json();

  const playerMetadata = await getPlayerMetadata(
    ship.id,
    ship.captain,
    ship.crew,
  );

  const { user } = await getUser(context);

  return {
    props: { ship: { ...ship, ...playerMetadata }, user },
  };
};
