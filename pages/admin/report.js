import fetcher from "@/utils/fetcher";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import {
  Button,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import Link from "next/link";
import moment from "moment";
import * as yup from "yup";
import { Check } from "react-feather";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const ModalReportDetail = ({ item }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isModalReportDetailOpen, setIsModalReportDetailOpen] = useState(false);

  const toggleModalReportDetail = () => {
    setIsModalReportDetailOpen(!isModalReportDetailOpen);
  };

  const processReport = async (id) => {
    const response = await fetcher.get(`/admin/report/process/${id}`, {
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    });
  };

  return (
    <>
      <Button
        className="button ms-auto"
        style={{ backgroundColor: "#00b4d8" }}
        onClick={toggleModalReportDetail}
      >
        Check Detail
      </Button>
      <div>
        <Modal
          isOpen={isModalReportDetailOpen}
          toggle={toggleModalReportDetail}
        >
          <ModalHeader
            toggle={toggleModalReportDetail}
            className="text-center px-4"
          >
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
            <div className="mt-3 d-flex">
              <Button
                color="light"
                className="me-3 ms-auto"
                onClick={toggleModalReportDetail}
              >
                Cancel
              </Button>
              {!item.processed && (
                <Button
                  type="submit"
                  style={{ border: "none", backgroundColor: "#00b4d8" }}
                  onClick={async () => {
                    try {
                      await processReport(item.id);
                      MySwal.fire({
                        icon: "success",
                        title: <p>Report has been processed</p>,
                        showConfirmButton: true,
                        showDenyButton: false,
                      }).then(() => {
                        toggleModalReportDetail();
                        router.reload();
                      });
                    } catch (error) {
                      MySwal.fire({
                        icon: "error",
                        title: <p>Something went wrong</p>,
                        showConfirmButton: true,
                        showDenyButton: false,
                      }).then(() => {
                        toggleModalReportDetail();
                      });
                    }
                  }}
                >
                  <Check /> Process
                </Button>
              )}
            </div>
          </ModalBody>
        </Modal>
      </div>
    </>
  );
};

export default function ManageReportPage(props) {
  const { data } = props;

  return (
    <div>
      <Container className="align-items-center justify-content-center mt-3">
        <h1>Manage Report</h1>

        <div className="mt-4">
          {data.content.map((item, index) => {
            const isProcessed = item.processed;
            return (
              <div
                key={index}
                className="border rounded border-2 p-3 mb-3 d-flex justify-content-between"
              >
                <div className="my-auto">
                  <div className="my-auto">
                    <span
                      className="badge badge-sm"
                      style={{
                        backgroundColor: isProcessed ? "#28a745" : "#00b4d8",
                      }}
                    >
                      {isProcessed ? "PROCESSED" : "NEW REPORT"}
                    </span>
                  </div>
                  Someone has reported{" "}
                  <span className="" style={{ color: "#00b4d8" }}>
                    <a
                      href={`/places/${item.post.id}`}
                      style={{ textDecoration: "none", color: "#00b4d8" }}
                    >
                      {item.post.title}
                    </a>
                  </span>{" "}
                  <span className="m-auto" style={{ fontSize: "20px" }}>
                    &middot;
                  </span>{" "}
                  <span>{moment(item.createdDate).fromNow()}</span>
                </div>
                <ModalReportDetail item={item} />
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const sessionData = await getSession(ctx);

  if (!sessionData || sessionData.user.role !== "ADMIN") {
    return {
      redirect: {
        destination: `/auth/login/?callbackUrl=${ctx.resolvedUrl}`,
        permanent: false,
      },
    };
  }
  console.log(sessionData.user.token);

  try {
    const response = await fetcher.get(`/admin/report/get?page=0&size=5`, {
      headers: {
        Authorization: `Bearer ${sessionData.user.token}`,
      },
    });
    const data = response.data.data;
    return {
      props: {
        data,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
