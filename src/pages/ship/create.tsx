import GeneralLayout from '@/layouts/GeneralLayout';
import { useUser } from '@supabase/auth-helpers-react';
import { Button, Label, TextInput } from 'flowbite-react';
import Router from 'next/router';
import { useState } from 'react';

export default function CreateShip() {
  const { user } = useUser();
  const [shipName, setShipName] = useState(``);
  const [loading, setLoading] = useState(false);

  return (
    <GeneralLayout>
      <div className="w-full flex flex-col items-center justify-center gap-4 h-full p-8">
        <h1 className="text-2xl font-dynapuff">
          Create a Ship for your crew to join!
        </h1>
        <div className="w-full md:w-1/2">
          <TextInput
            sizing={`lg`}
            type="text"
            id="ship-name"
            placeholder="The Thousand Sunny"
            value={shipName}
            minLength={1}
            onChange={(e) => setShipName(e.target.value)}
          />
        </div>

        <Button
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            const response = await fetch(`/api/ship`, {
              method: `POST`,
              body: JSON.stringify({ captain: user!.id, ship: shipName }),
              headers: {
                'Content-Type': `application/json`,
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
    </GeneralLayout>
  );
}
