import { useUser } from '@supabase/auth-helpers-react';
import { Button, TextInput } from 'flowbite-react';
import Router from 'next/router';
import { useState } from 'react';

export default function createShip() {
  const { user } = useUser();
  const [captainName, setCaptainName] = useState('');
  const [shipName, setShipName] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <h1>Create a Ship for your crew to join!</h1>
      <TextInput
        type="text"
        id="captain-name-input"
        placeholder="Luffy"
        value={captainName}
        minLength={1}
        onChange={(e) => setCaptainName(e.target.value)}
      />
      <TextInput
        type="text"
        id="ship-name-input"
        placeholder="The Thousand Sunny"
        value={shipName}
        minLength={1}
        onChange={(e) => setShipName(e.target.value)}
      />
      <Button
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          const response = await fetch(`/api/ship`, {
            method: 'POST',
            body: JSON.stringify({ captain: user!.id, ship: shipName }),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 200) {
            const resJson = await response.json();
            const currentShipId = resJson.id;
            Router.push(`/ship/${currentShipId}`);
          }
          setLoading(false);
        }}
      >
        Create Ship
      </Button>
    </div>
  );
}
