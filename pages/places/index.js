import fetcher from "@/utils/fetcher";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import { Button, Col, Container, Row } from "reactstrap";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import Link from "next/link";
import { MapPin, Star } from "react-feather";

export default function PlacesPage(props) {
  const { id, data, query } = props;
  const router = useRouter();
  const pageNumber = Number(query.page ?? 1);
  // console.log(data, "DATA!!");
  return (
    <div>
      <Container className="align-items-center justify-content-center">
        <div className="d-flex py-4 align-items-center justify-content-between">
          <h1 className="">Places Page</h1>
          <Button className="" color="primary" href={`places/addPlace`}>
            Suggest Place
          </Button>
        </div>

        {/* <div className="py-2">
          <p>Page: {data.page}</p>
          <p>Total Page: {data.totalPages}</p>
        </div> */}

        <div className="row">
          {data.data.map((item, index) => (
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
                  <h5 className="card-title text-truncate">{item.title}</h5>
                  <p className="card-text text-truncate">{item.description}</p>
                  <p className="card-text">
                    <MapPin className="me-1" size={18} />
                    {item.city}
                  </p>
                  <p className="">
                    <Star
                      className="me-1"
                      size={18}
                      color="yellow"
                      fill="yellow"
                    />
                    {item.averageRating} ({item.totalRating})
                  </p>
                  <Link href={`/places/${item.id}`} className="btn btn-primary">
                    See more
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <ReactPaginate
          previousLabel="previous"
          nextLabel="next"
          onPageChange={({ selected }) => {
            router.push(`/places?page=${selected + 1}`);
          }}
          hrefBuilder={(page, pageCount, selected) =>
            page >= 1 && page <= data.totalPages ? `/places?page=${page}` : "#"
          }
          hrefAllControls
          pageCount={data.totalPages}
          breakLabel="..."
          pageRangeDisplayed={4}
          marginPagesDisplayed={2}
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          activeClassName="active"
          forcePage={pageNumber - 1}
          renderOnZeroPageCount={null}
        />
      </Container>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const { query } = ctx;
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
    const response = await axios.get(
      `http://localhost:3000/api/paginate-places`,
      {
        headers: {
          Authorization: `Bearer ${sessionData.user.token}`,
        },
        params: {
          page: query.page ?? 1,
        },
      }
    );
    const data = response.data;
    return {
      props: {
        data,
        query,
      },
    };
  } catch (error) {
    // console.log(error);
    return {
      notFound: true,
    };
  }
}
