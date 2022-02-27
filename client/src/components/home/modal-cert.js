import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const ModalCert = (props) => {
  const {
    buttonText,
    title,
    cancelButtonText,
    className,
    ipfsHash,
    whenClick,
  } = props;
  
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  
  return (
    <div>
      <div onClick={toggle}>
        <a style={{cursor:'pointer', textDecoration:'underline', fontWeight:'bold'}} onClick={whenClick}>{buttonText}</a>
      </div>
      <Modal
        size="lg"
        animation={"false"}
        isOpen={modal}
        toggle={toggle}
        className={className}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <ModalHeader className=" border-1">{title}</ModalHeader>
        <ModalBody className="text-center border-0">
          <a
            href={`https://ipfs.io/ipfs/${buttonText}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="modal-image"
              style={{ position: "relative", width: "100%" }}
              src={`https://ipfs.io/ipfs/${buttonText}`}
              alt=""
            />
          </a>
        </ModalBody>
        <ModalFooter className="modal-footer border-0">
          <Button className="btn_secondary modal-btn" onClick={toggle}>
            {cancelButtonText}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ModalCert;