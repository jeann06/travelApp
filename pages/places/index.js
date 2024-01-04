import fetcher from "@/utils/fetcher";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import { Button, Col, Container, Row } from "reactstrap";

export default function PlacesPage(props) {
  const { id, data } = props;

  console.log(data, "DATA!!");
  return (
    <div>
      <h1 className="text-center py-5">Places Page</h1>

      <Container className="align-items-center justify-content-center">
        <div className="row">
          {data.map((item, index) => (
            <div key={index} className="mb-4 col-lg-3 col-md-4 col-sm-6">
              <div className="card">
                <img
                  src={`http://localhost:8080/${item.fileUrl}`}
                  class="card-img-top object-fit-cover"
                  width={150}
                  height={300}
                  alt=""
                />
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">{item.description}</p>
                  <a href="#" className="btn btn-primary">
                    Go somewhere
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
      <Button className="bg-primary" href={`places/addPlace`}>
        Suggest Place
      </Button>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const { query, params } = ctx;
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
    const response = await fetcher.get(`/post/getAll`, {
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
    console.log(error);
    return {
      notFound: true,
    };
  }
}
