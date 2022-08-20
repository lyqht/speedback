import { baseUrl } from '@/Config';
import { CrewMember } from '@/types/CrewMember';
import { Ship } from '@/types/Ship';
import { getUser, supabaseClient, User } from '@supabase/auth-helpers-nextjs';
import { Button } from 'flowbite-react';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import AvatarWithStatus from '../../components/AvatarWithStatus';
import Clipboard from '../../components/Clipboard';

interface Props {
  ship: Ship;
  user: User;
  ready?: boolean;
}

const addRealtimeNotification = (newContent: string) => {
  const newElement = document.createElement('p');
  newElement.appendChild(document.createTextNode(newContent));

  const notificationsCorner = document.getElementById('realtime-notifications');
  notificationsCorner?.appendChild(newElement);

  setTimeout(() => {
    notificationsCorner?.removeChild(newElement);
  }, 1200);
};

export default function ShipWaitingHall({ ship, user, ready = false }: Props) {
  // this causes the alert to show up when Next.js auto-refresh from server
  // useLeavePageConfirm(true);

  const [currentCrew, setCurrentCrew] = useState<CrewMember[]>(ship.crew);

  const isCaptain = ship.captain === user.id;
  const crewIsReady =
    currentCrew.length > 0 &&
    currentCrew.map((member: CrewMember) => member.ready).length ===
      currentCrew.length;

  useEffect(() => {
    // subscriber for ready checks
    const readySubscriber = supabaseClient
      .from(`Ship:id=eq.${ship.id}`)
      .on('UPDATE', (payload) => {
        setCurrentCrew(payload.new.crew);
      })
      .subscribe();

    return () => {
      readySubscriber.unsubscribe();
    };
  }, []);

  return (
    <div className="h-full">
      <h1>{ship.name}</h1>
      <p>Host: {ship.captain}</p>
      {ship.code && (
        <Clipboard value={ship.code} fieldToBeCopied={'room code'} />
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
              className={`${
                ready ? 'bg-red-400' : 'bg-green-400'
              } transition-colors p-4 shadow-sm border text-white`}
              onClick={async () => {
                await fetch(`/api/ship/${ship.id}`, {
                  method: 'POST',
                  body: JSON.stringify({ userId: user!.id, shipId: ship.id }),
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
              }}
            >
              Ready
            </button>
          </>
        ) : (
          <>
            <Button disabled={!crewIsReady} gradientDuoTone="greenToBlue">
              Start Session
            </Button>
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
