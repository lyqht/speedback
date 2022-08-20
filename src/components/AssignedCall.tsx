import ExpiryTimer from '@/components/ExpiryTimer';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { Card } from 'flowbite-react';
import { useEffect, useRef } from 'react';

// TODO: checkout responsive iframe styles
// https://www.benmarshall.me/responsive-iframes/
const CALL_OPTIONS = {
  showLeaveButton: true,
  iframeStyle: {
    height: `100%`,
    width: `100%`,
    aspectRatio: `16 / 9`,
    minwidth: `400px`,
    border: `0`,
    borderRadius: `12px`,
  },
};

type Props = {
  room: string;
  callFrame: DailyCall | null;
  setCallFrame: (callframe: DailyCall | null) => void;
  expiry: number;
};

export function AssignedCall({ room, callFrame, setCallFrame, expiry }: Props) {
  const callRef = useRef(null);
  let isAlreadyCreated = false;

  const leaveCall = () => {
    if (callFrame) {
      callFrame.destroy();
      setCallFrame(null);
    }
  };

  const createAndJoinCall = () => {
    if (isAlreadyCreated) {
      return;
    }
    const newCallFrame = DailyIframe.createFrame(
      callRef?.current as any,
      CALL_OPTIONS,
    );

    newCallFrame.join({ url: room });
    newCallFrame.on(`left-meeting`, leaveCall);
    setCallFrame(newCallFrame);
    isAlreadyCreated = true;
  };

  useEffect(() => {
    if (callFrame) return;
    createAndJoinCall();
  }, []);

  return (
    <div className="w-full h-full p-8">
      <div id="call" ref={callRef} />
      <Card>
        <div>
          {expiry && (
            <div>
              Room expires in:
              <ExpiryTimer expiry={expiry} />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default AssignedCall;
