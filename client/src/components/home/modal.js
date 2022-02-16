import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

// NOTICE
// Modal is brought in with it's own trigger, so import the component where you want the trigger to be.

const ModalComponent = (props) => {
  const {
    buttonText,
    title,
    actionButtonText,
    cancelButtonText,
    className,
    whenClicked
  } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);


  return (
    <div>
      <div onClick={toggle}>{buttonText}</div>
      <Modal animation={"false"} isOpen={modal} toggle={toggle} className={className}>
        <form onSubmit={whenClicked}>
          <ModalHeader className=" border-1">
            {title}
          </ModalHeader>
          <ModalBody className="text-left border-0">
            <p className="modal-label">Eenter Issuer Address</p>
     
                <input type="text" name="address" id="issuer-address" name="issuer-address"className="form-control" placeholder="Address" />

          </ModalBody>
          <ModalFooter className="modal-footer border-0">
            <Button className="btn_secondary modal-btn" onClick={toggle}>
              {cancelButtonText}
            </Button>{" "}
            &nbsp;&nbsp;
            <Button className="btn btn_primary modal-btn" type="submit">
                {actionButtonText}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

export default ModalComponent;