import { baseUrl } from '@/Config';
import { CrewMember } from '@/types/CrewMember';
import { Ship } from '@/types/Ship';
import { getUser, supabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import Clipboard from '../../components/Clipboard';
import AvatarWithStatus from '../../components/AvatarWithStatus';

interface Props {
  ship: Ship;
  isOwner: boolean;
}

export default function ShipWaitingHall({ ship }: Props) {
  useEffect(() => {
    const subscriber = supabaseClient
      .from(`Ship:id=eq.${ship.id}`)
      .on('UPDATE', (payload) => {
        console.log('Change received!', payload);
        const newElement = document.createElement('p');
        newElement.appendChild(document.createTextNode(payload.new));

        const notificationsCorner = document.getElementById(
          'realtime-notifications',
        );
        notificationsCorner?.appendChild(newElement);

        setTimeout(() => {
          notificationsCorner?.removeChild(newElement);
        }, 1200);
      })
      .subscribe();

    return () => {
      subscriber.unsubscribe();
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
        <p>Crew joined: {ship.crew.length ?? 0}</p>
        <AvatarWithStatus.Captain name={ship.captain} />

        {ship.crew
          ? ship.crew?.map((crewMember: CrewMember) => (
              <AvatarWithStatus.Crew
                key={crewMember.userId}
                name={crewMember.userId}
                ready={crewMember.ready}
              />
            ))
          : null}
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

  const currentUser = await getUser(context);
  const isOwner = ship.captain === currentUser.user.id;

  return {
    props: { ship, isOwner },
  };
};
