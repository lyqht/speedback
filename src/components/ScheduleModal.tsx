import { Button, Modal } from 'flowbite-react';
import React from 'react';

type Props = {
  show: boolean;
  onClickStart: () => void;
  onClickCancel: () => void;
};

const ScheduleModal = ({ show, onClickStart, onClickCancel }: Props) => {
  return (
    <React.Fragment>
      <Modal show={show}>
        <Modal.Header>Speedback Schedule</Modal.Header>
        <Modal.Body>
          <div className="space-y-6"></div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClickStart}>Start</Button>
          <Button color="gray" onClick={onClickCancel}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default ScheduleModal;
