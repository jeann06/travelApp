import fetcher from "@/utils/fetcher";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import { Button, Col, Container, Row } from "reactstrap";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import Link from "next/link";

export default function NotificationPage(props) {
  const { data } = props;
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <div>
      <Container className="align-items-center justify-content-center mt-3">
        <h1>Manage Claim</h1>

        <div className="mt-4">
          <div className="border rounded border-2 p-3 mb-3 d-flex justify-content-between">
            <div className="my-auto">
              <div className="my-auto">
                <span
                  className="badge badge-sm"
                  style={{ backgroundColor: "#00b4d8" }}
                >
                  NEW CLAIM
                </span>
              </div>
              Agung Podomoro Group has requested claim on{" "}
              <span className="" style={{ color: "#00b4d8" }}>
                Central Park Mall
              </span>{" "}
              &middot; 20 minutes ago
            </div>
            <Button className="button" style={{ backgroundColor: "#00b4d8" }}>
              Check Detail
            </Button>
          </div>
        </div>
        <div className="mt-2">
          <div className="border rounded border-2 p-3 mb-3 d-flex justify-content-between">
            <div className="my-auto">
              <div className="my-auto">
                <span
                  className="badge badge-sm"
                  style={{ backgroundColor: "#00b4d8" }}
                >
                  NEW CLAIM
                </span>
              </div>
              jeaniewnt has requested claim on{" "}
              <span className="" style={{ color: "#00b4d8" }}>
                The Cat Cabin
              </span>{" "}
              &middot; 34 minutes ago
            </div>
            <Button className="button" style={{ backgroundColor: "#00b4d8" }}>
              Check Detail
            </Button>
          </div>
        </div>
        <div className="mt-2">
          <div className="border rounded border-2 p-3 mb-3 d-flex justify-content-between">
            <div className="my-auto">
              <div className="my-auto">
                <span
                  className="badge badge-sm"
                  style={{ backgroundColor: "#00b4d8" }}
                >
                  NEW CLAIM
                </span>
              </div>
              Cipinang Indah Mall has requested claim on{" "}
              <span className="" style={{ color: "#00b4d8" }}>
                Cipinang Indah Mall
              </span>{" "}
              &middot; 1 hour ago
            </div>
            <Button className="button" style={{ backgroundColor: "#00b4d8" }}>
              Check Detail
            </Button>
          </div>
        </div>
        <div className="mt-2">
          <div className="border rounded border-2 p-3 mb-3 d-flex justify-content-between">
            <div className="my-auto">
              <div className="my-auto">
                <span className="badge badge-sm bg-success">APPROVED</span>
              </div>
              Mouse Coffee has requested claim on{" "}
              <span className="" style={{ color: "#00b4d8" }}>
                Mouse Coffee
              </span>{" "}
              &middot; 6 hours ago
            </div>
            <Button className="button" style={{ backgroundColor: "#00b4d8" }}>
              Check Detail
            </Button>
          </div>
        </div>
        <div className="mt-2">
          <div className="border rounded border-2 p-3 mb-3 d-flex justify-content-between">
            <div className="my-auto">
              <div className="my-auto">
                <span className="badge badge-sm bg-danger">REJECTED</span>
              </div>
              ashield has requested claim on{" "}
              <span className="" style={{ color: "#00b4d8" }}>
                Central Park Mall
              </span>{" "}
              &middot; 19 hours ago
            </div>
            <Button className="button" style={{ backgroundColor: "#00b4d8" }}>
              Check Detail
            </Button>
          </div>
        </div>
        <div className="mt-2">
          <div className="border rounded border-2 p-3 mb-3 d-flex justify-content-between">
            <div className="my-auto">
              <div className="my-auto">
                <span className="badge badge-sm bg-success">APPROVED</span>
              </div>
              Neo Soho has requested claim on{" "}
              <span className="" style={{ color: "#00b4d8" }}>
                Neo Soho
              </span>{" "}
              &middot; 23 hours ago
            </div>
            <Button className="button" style={{ backgroundColor: "#00b4d8" }}>
              Check Detail
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

// export async function getServerSideProps(ctx) {
//   const sessionData = await getSession(ctx);

//   if (!sessionData) {
//     return {
//       redirect: {
//         destination: `/auth/login/?callbackUrl=${ctx.resolvedUrl}`,
//         permanent: false,
//       },
//     };
//   }
//   console.log(sessionData.user.token);

//   try {
//     const response = await fetcher.get(
//       `/notification/notifications/get?page=0&size=10`,
//       {
//         headers: {
//           Authorization: `Bearer ${sessionData.user.token}`,
//         },
//       }
//     );
//     const data = response.data.data;
//     return {
//       props: {
//         data,
//       },
//     };
//   } catch (error) {
//     return {
//       notFound: true,
//     };
//   }
// }
