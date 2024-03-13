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
import {
  CLAIM_APPROVED,
  CLAIM_NEW,
  CLAIM_REJECTED,
  CLAIM_TEXT,
} from "@/components/constants";
import moment from "moment";
import { Check, X } from "react-feather";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const getBackgroundColor = (status) => {
  if (status === CLAIM_APPROVED) {
    return "#28a745";
  }
  if (status === CLAIM_REJECTED) {
    return "#dc3545";
  }
  return "#00b4d8";
};

const ModalClaimDetail = ({ item }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isModalReportDetailOpen, setIsModalReportDetailOpen] = useState(false);

  const toggleModalReportDetail = () => {
    setIsModalReportDetailOpen(!isModalReportDetailOpen);
  };

  const approveClaim = async (id) => {
    const response = await fetcher.get(`/admin/claim/approve/${id}`, {
      headers: {
        Authorization: `Bearer ${session?.user.token}`,
      },
    });
  };

  const rejectClaim = async (id, message) => {
    const response = await fetcher.post(
      `/admin/claim/reject/${id}`,
      {
        string: message,
      },
      {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      }
    );
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
            Claim Detail
          </ModalHeader>
          <ModalBody className="mb-3">
            Someone has claimed{" "}
            <span className="" style={{ color: "#00b4d8" }}>
              <a
                href={`/places/${item.post.id}`}
                style={{ textDecoration: "none", color: "#00b4d8" }}
              >
                {item.post.title}
              </a>
            </span>{" "}
            on {moment(item.createdDate).format("DD MMMM YYYY")} <br></br>
            Description: {item.description} <br></br>
            File:{" "}
            {item.claimDetails.map((file, index) => {
              return (
                <a
                  key={index}
                  href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/claim-details/${file.fileName}`}
                  style={{ textDecoration: "none", color: "#00b4d8" }}
                  target="_blank"
                >
                  {file.originalFileName}
                </a>
              );
            })}
            <div className="mt-3 d-flex">
              <Button
                color="light"
                className="me-3 ms-auto"
                onClick={toggleModalReportDetail}
              >
                Cancel
              </Button>
              {item.status == CLAIM_NEW && (
                <div>
                  {" "}
                  <Button
                    className="bg-success"
                    type="submit"
                    style={{ border: "none" }}
                    onClick={async () => {
                      try {
                        await approveClaim(item.id);
                        MySwal.fire({
                          icon: "success",
                          title: <p>Claim approved!</p>,
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
                    <Check /> Approve
                  </Button>
                  <Button
                    className="ms-3 bg-danger"
                    type="submit"
                    style={{ border: "none" }}
                    onClick={async () => {
                      try {
                        MySwal.fire({
                          icon: "question",
                          title: <p>Input reject message</p>,
                          input: "text",
                        }).then((result) => {
                          if (result.value) {
                            rejectClaim(item.id, result.value).then(() => {
                              toggleModalReportDetail();
                              router.reload();
                            });
                          }
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
                    <X /> Reject
                  </Button>
                </div>
              )}
            </div>
          </ModalBody>
        </Modal>
      </div>
    </>
  );
};

export default function NotificationPage(props) {
  const { data } = props;
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <div>
      <Container className="align-items-center justify-content-center mt-3">
        <h1>Manage Claim</h1>
        <div className="mt-4">
          {data.content.map((item, index) => {
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
                        backgroundColor: getBackgroundColor(item.status),
                      }}
                    >
                      {CLAIM_TEXT[item.status]}
                    </span>
                  </div>
                  {item.user.username} has requested claim on{" "}
                  <span className="" style={{ color: "#00b4d8" }}>
                    <a
                      href={`/places/${item.post.id}`}
                      style={{ textDecoration: "none", color: "#00b4d8" }}
                    >
                      {item.post.title}
                    </a>
                  </span>{" "}
                  &middot; <span>{moment(item.createdDate).fromNow()}</span>
                </div>
                <ModalClaimDetail item={item} />
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
    const response = await fetcher.get(`/admin/claim/getAll?page=0&size=5`, {
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
  } catch (error) {}
}
