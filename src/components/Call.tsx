import ExpiryTimer from '@/components/ExpiryTimer';
import DailyIframe from '@daily-co/daily-js';
import { Card } from 'flowbite-react';
import { useEffect, useRef } from 'react';
import Clipboard from './Clipboard';

// TODO: checkout responsive iframe styles
// https://www.benmarshall.me/responsive-iframes/
const CALL_OPTIONS = {
  showLeaveButton: true,
  iframeStyle: {
    height: '100%',
    width: '100%',
    aspectRatio: 16 / 9,
    minwidth: '400px',
    maxWidth: '920px',
    border: '0',
    borderRadius: '12px',
  },
};

export function Call({ room, setRoom, callFrame, setCallFrame, expiry }) {
  const callRef = useRef(null);
  let isAlreadyCreated = false;

  const leaveCall = () => {
    setRoom(null);
    setCallFrame(null);
    callFrame.destroy();
  };

  const createAndJoinCall = () => {
    if (isAlreadyCreated) {
      return;
    }
    const newCallFrame = DailyIframe.createFrame(
      callRef?.current,
      CALL_OPTIONS,
    );

    newCallFrame.join({ url: room });
    newCallFrame.on('left-meeting', leaveCall);
    setCallFrame(newCallFrame);
    isAlreadyCreated = true;
  };

  useEffect(() => {
    if (callFrame) return;
    createAndJoinCall();
  }, []);

  return (
    <div>
      <div className="call-container">
        <div id="call" ref={callRef} />
        <Card>
          <p>Copy and share the URL to invite others</p>
          <Clipboard value={room} fieldToBeCopied={'room URL'} />
          <div>
            {expiry && (
              <div>
                Room expires in:
                <ExpiryTimer expiry={expiry} />
              </div>
            )}
          </div>
        </Card>
        <style jsx>{`
          .call-container {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
          }
          .call-container :global(.call) {
            width: 100%;
          }
          .call-container :global(.button) {
            margin-top: var(--spacing-md);
          }
          .call-container :global(.card) {
            max-width: 300px;
            max-height: 400px;
          }
          .call-container :global(.card-footer) {
            align-items: center;
            gap: var(--spacing-xxs);
          }
          .call-container :global(.countdown) {
            position: static;
            border-radius: var(--radius-sm);
          }
          @media only screen and (max-width: 750px) {
            .call-container {
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default Call;
