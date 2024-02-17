import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useState } from "react";

const CheckDetailAction = ({ data, session, toggleModal }) => {
  const [isModalReportDetailOpen, setIsModalReportDetailOpen] = useState(false);
  return (
    <div>
      <Modal isOpen={isModalReportDetailOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal} className="text-center px-4">
          Report Detail
        </ModalHeader>
        <ModalBody className="mb-3">
          Someone has reported{" "}
          <span className="" style={{ color: "#00b4d8" }}>
            <a
              href={`/places/${item.post.id}`}
              style={{ textDecoration: "none", color: "#00b4d8" }}
            >
              {item.post.title}
            </a>
          </span>{" "}
          on {moment(item.createdDate).format("DD MMMM YYYY")} <br></br>
          Reason: {item.message}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default CheckDetailAction;
