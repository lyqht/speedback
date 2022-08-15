import Call from '@/components/Call';
import { Button, TextInput } from 'flowbite-react';
import { useCallback, useRef, useState } from 'react';

export function Room() {
  const roomRef = useRef(null);
  const [isError, setIsError] = useState(false);
  const [room, setRoom] = useState(null);
  const [expiry, setExpiry] = useState(null);
  const [callFrame, setCallFrame] = useState(null);
  const [isValidRoom, setIsValidRoom] = useState(false);

  const checkValidity = useCallback(
    (e) => {
      if (e?.target?.checkValidity()) {
        setIsValidRoom(true);
      }
    },
    [isValidRoom],
  );
  const createRoom = async () => {
    try {
      const res = await fetch('api/room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      setExpiry(result.config?.exp);
      setRoom(result.url);
    } catch (e) {
      console.error(e);
      setIsError(true);
    }
  };
  const joinCall = useCallback(() => {
    const roomUrl = roomRef?.current?.value;
    setRoom(roomUrl);
  }, [roomRef]);

  return (
    <div>
      {room ? (
        <>
          <Call
            room={room}
            expiry={expiry}
            setRoom={setRoom}
            setCallFrame={setCallFrame}
            callFrame={callFrame}
          />
        </>
      ) : (
        <>
          <h1>Room Settings</h1>
          <Button onClick={createRoom} disabled={isValidRoom}>
            Create room and start
          </Button>
          {isError && <div>Error creating the room. Please try again.</div>}
          <h2>Or enter room to join</h2>
          <TextInput
            ref={roomRef}
            type="text"
            placeholder="Enter room URL..."
            pattern="^(https:\/\/)?[\w.-]+(\.(daily\.(co)))+[\/\/]+[\w.-]+$"
            onChange={checkValidity}
          />
          <Button onClick={joinCall} disabled={!isValidRoom}>
            Join room
          </Button>
        </>
      )}
    </div>
  );
}

export default Room;
