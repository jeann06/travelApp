import fetcher from "@/utils/fetcher";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import { Button, Col, Container, Row } from "reactstrap";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import Link from "next/link";
import moment from "moment";

export default function NotificationPage(props) {
  const { data } = props;
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <div>
      <Container className="align-items-center justify-content-center mt-3">
        <h1>Profile</h1>

        <div className="card p-4" style={{ width: "300px" }}>
          <img
            src={`http://localhost:8080/${data.profileUrl}`}
            alt=""
            width="100"
            height="100"
            className="mx-auto rounded-circle"
          />
          <span
            className="mx-auto fw-semibold mt-3"
            style={{ fontSize: "20px" }}
          >
            {data.fullName}
          </span>
          <span className="mx-auto">@{data.username}</span>
          <span className="mt-2 mx-auto" style={{ fontSize: "15px" }}>
            Born {moment(data.dob).format("DD MMMM YYYY")}
          </span>
          <span className="mx-auto" style={{ fontSize: "15px" }}>
            Joined {moment(data.createdDate).format("DD MMMM YYYY")}
          </span>

          <Button
            className="m-auto mt-3 fw-semibold rounded-pill border"
            color="none"
            style={{ width: "130px", height: "40px" }}
            onClick={() => router.push(`/`)}
            hover={{ backgroundColor: "#000000" }}
          >
            Edit Profile
          </Button>
        </div>
      </Container>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const sessionData = await getSession(ctx);

  if (!sessionData) {
    return {
      redirect: {
        destination: `/auth/login/?callbackUrl=${ctx.resolvedUrl}`,
        permanent: false,
      },
    };
  }
  console.log(sessionData.user.token);

  try {
    const response = await fetcher.get(`/user/get`, {
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
