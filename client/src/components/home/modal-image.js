import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const ModalImage = (props) => {
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
      <div onClick={toggle}><button
                    type="submit"
                    className="button-submit"
                    onClick={whenClick}
                  >
                    <span>{buttonText}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M0 11c2.761.575 6.312 1.688 9 3.438 3.157-4.23 8.828-8.187 15-11.438-5.861 5.775-10.711 12.328-14 18.917-2.651-3.766-5.547-7.271-10-10.917z" />
                    </svg>
                  </button></div>
      <Modal size="lg" animation={"false"} isOpen={modal} toggle={toggle} className={className} aria-labelledby="contained-modal-title-vcenter"
      centered>
          <ModalHeader className=" border-1">
            {title}
          </ModalHeader>
          <ModalBody className="text-center border-0">
            <a
                  href={`https://ipfs.io/ipfs/${ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img className="modal-image" style={{ position: 'relative', width: '100%' }}

                    src={`https://ipfs.io/ipfs/${ipfsHash}`}
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

export default ModalImage;