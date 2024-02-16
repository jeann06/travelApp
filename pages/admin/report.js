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
        <h1>Manage Report</h1>

        <div className="mt-4">
          <div className="border rounded border-2 p-3 mb-3 d-flex justify-content-between">
            <div className="my-auto">
              <div className="my-auto">
                <span
                  className="badge badge-sm"
                  style={{ backgroundColor: "#00b4d8" }}
                >
                  NEW REPORT
                </span>
              </div>
              user001 has reported{" "}
              <span className="" style={{ color: "#00b4d8" }}>
                Mouse Coffee
              </span>{" "}
              &middot; 2 minutes ago
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
                  NEW REPORT
                </span>
              </div>
              jeaniewnt has reported ashield's review on{" "}
              <span className="" style={{ color: "#00b4d8" }}>
                Four Meeples
              </span>{" "}
              &middot; 14 minutes ago
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
                <span className="badge badge-sm bg-success">PROCESSED</span>
              </div>
              mason756 has reported bolly009's review on{" "}
              <span className="" style={{ color: "#00b4d8" }}>
                Tebet Eco Park
              </span>{" "}
              &middot; 3 hours ago
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
                <span className="badge badge-sm bg-success">PROCESSED</span>
              </div>
              futhehammy has reported{" "}
              <span className="" style={{ color: "#00b4d8" }}>
                Taman Menteng
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
                <span className="badge badge-sm bg-success">PROCESSED</span>
              </div>
              sukatraveling has reported{" "}
              <span className="" style={{ color: "#00b4d8" }}>
                Bandar Djakarta
              </span>{" "}
              &middot; 19 hours ago
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
