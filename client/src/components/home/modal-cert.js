import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { PulseSpinner  } from "react-spinners-kit";

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
  const [loading, setLoading] = useState(true);

  const toggle = () => setModal(!modal);

  
  return (
    <div>
      <div onClick={toggle}>
        <a
          style={{
            cursor: "pointer",
            textDecoration: "underline",
            fontWeight: "bold",
          }}
          onClick={whenClick}
        >
          {buttonText}
        </a>
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
          <div style={{ display: loading ? "block" : "none", margin: "0 auto", width: "10%"}}>
          <PulseSpinner color="#686769" />
          </div>
          <a
            href={`https://ipfs.io/ipfs/${buttonText}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="modal-image"
              style={{
                position: "relative",
                width: "100%",
                display: loading ? "none" : "block",
              }}
              src={`https://ipfs.io/ipfs/${buttonText}`}
              alt="certificate image"
              onLoad={() => setLoading(false)}
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