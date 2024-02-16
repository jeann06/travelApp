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
        <h1>Notification</h1>

        <div className="mt-4">
          {data.content.map((item, index) => {
            return (
              <div key={index} className="border rounded border-2 p-3 mb-3">
                <div
                  className="d-flex gap-2 align-items-center"
                  style={{ fontSize: 14 }}
                >
                  <span
                    className="badge badge-sm"
                    style={{ backgroundColor: "#00b4d8" }}
                  >
                    {item.category}
                  </span>
                  &middot;
                  <span>{moment(item.createdDate).fromNow()}</span>
                </div>
                <strong>{item.title}</strong>
                <div>{item.message}</div>
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
    const response = await fetcher.get(
      `/notification/notifications/get?page=0&size=10`,
      {
        headers: {
          Authorization: `Bearer ${sessionData.user.token}`,
        },
      }
    );
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
