import { baseUrl } from '@/Config';
import { Ship } from '@/types/Ship';
import { GetServerSideProps } from 'next';

interface Props {
  ship: Ship;
}

export default function ShipWaitingRoom({ ship }: Props) {
  return (
    <div>
      <h1>{ship.name}</h1>
      <p>Host: {ship.captain}</p>
      <p>Participants: {ship.crew ? ship.crew.length : 0}</p>
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
