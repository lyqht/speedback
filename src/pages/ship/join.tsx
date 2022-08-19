import { useUser } from '@supabase/auth-helpers-react';
import { Button, Label, TextInput } from 'flowbite-react';
import Router from 'next/router';
import { useState } from 'react';

export default function joinShip() {
  const { user } = useUser();
  const [shipCode, setShipCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <h1>Join a Ship</h1>
      <Label value="Ship Code" />
      <TextInput
        type="text"
        id="room-code-input"
        placeholder="6 alphanumeric code"
        value={shipCode}
        minLength={6}
        maxLength={6}
        onChange={(e) => setShipCode(e.target.value)}
      />
      <TextInput
        type="text"
        id="nickname-input"
        placeholder="Zoroto"
        value={nickname}
        minLength={1}
        required={true}
        onChange={(e) => setNickname(e.target.value)}
      />
      <Button
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          const response = await fetch(`/api/ship/join`, {
            method: 'POST',
            body: JSON.stringify({ userId: user!.id, shipCode }),
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
        Join Ship
      </Button>
    </div>
  );
}
