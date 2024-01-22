import fetcher from "@/utils/fetcher";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import { Button, Col, Container, Row } from "reactstrap";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import Link from "next/link";
import moment from "moment";
import { MapPin, Star } from "react-feather";

export default function NotificationPage(props) {
  const { data, content, dataPost } = props;
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <div>
      <Container className="align-items-center justify-content-center mt-3">
        <h1 className="mb-3">Profile</h1>

        <div className="d-flex">
          <div className="card p-4 my-auto" style={{ width: "300px" }}>
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/${data.profileUrl}`}
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
              color="light"
              style={{ width: "130px", height: "40px" }}
              onClick={() => router.push(`/editProfile`)}
              hover={{ backgroundColor: "#000000" }}
            >
              Edit Profile
            </Button>
          </div>

          <div className="ms-4">
            <h3>My Post</h3>
            <div className="row">
              {content.map((item, index) => (
                <div key={index} className="col mb-4">
                  <Link
                    style={{ textDecoration: "none" }}
                    href={`/places/${item.id}`}
                  >
                    <div className="card">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${item.fileUrl}`}
                        className="card-img-top object-fit-cover"
                        width={150}
                        height={180}
                        alt=""
                      />
                      <div className="card-body">
                        <span
                          className="border border-1 rounded px-2 py-1 mb-2"
                          style={{
                            display: "inline-block",
                            borderRadius: "10px",
                            backgroundColor: "#ffc78f",
                          }}
                        >
                          <p className="card-text" style={{ fontSize: "13px" }}>
                            {item.category}
                          </p>
                        </span>
                        <h6
                          className="card-title"
                          style={{
                            overflow: "hidden",
                            height: "40px",
                          }}
                        >
                          {item.title}
                        </h6>

                        <span className="card-text">
                          <MapPin className="me-1" size={18} />
                          {item.city}
                        </span>
                        <p className="m-0">
                          <Star
                            className="me-1"
                            size={18}
                            color="#ffe234"
                            fill="#ffe234"
                          />
                          {item.averageRating} ({item.totalRating})
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
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

    const responsePost = await fetcher.get(
      `/user/posts/${sessionData.user.username}`
    );

    const dataPost = responsePost.data.data;
    const content = dataPost.content;
    return {
      props: {
        data,
        dataPost,
        content,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
