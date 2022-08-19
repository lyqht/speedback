import { baseUrl } from '@/Config';
import { Ship } from '@/types/Ship';
import { GetServerSideProps } from 'next';
import Clipboard from '../../components/Clipboard';
import { useEffect } from 'react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { CrewMember } from '@/types/CrewMember';

interface Props {
  ship: Ship;
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
      {ship.crew ? (
        <div>
          <p>Participants: {ship.crew.length ?? 0}</p>
          {ship.crew?.map((crewMember: CrewMember) => (
            <div key={crewMember.userId}>
              <div>{crewMember.userId}</div>
              <div>Ready: {crewMember.ready ? 'Yes' : 'No'}</div>
            </div>
          ))}
        </div>
      ) : null}
      <div
        id="realtime-notifications"
        className="border-solid border-4 border-blue-400 bg-slate-400 h-1/3 w-1/3"
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ship = await (
    await fetch(`${baseUrl}/api/ship?id=${context.query.id}`)
  ).json();

  return {
    props: { ship },
  };
};
