import fetcher from "@/utils/fetcher";
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import { Button, Col, Container, Row } from "reactstrap";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from "reactstrap";

function CarouselImages({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = items.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.src}
      >
        <img
          src={item.src}
          className="object-fit-cover"
          width={1600}
          height={400}
          alt={item.altText}
        />
        {/* <CarouselCaption
            captionText={item.caption}
            captionHeader={item.caption}
          /> */}
      </CarouselItem>
    );
  });

  return (
    <Carousel activeIndex={activeIndex} next={next} previous={previous}>
      <CarouselIndicators
        items={items}
        activeIndex={activeIndex}
        onClickHandler={goToIndex}
      />
      {slides}
      <CarouselControl
        direction="prev"
        directionText="Previous"
        onClickHandler={previous}
      />
      <CarouselControl
        direction="next"
        directionText="Next"
        onClickHandler={next}
      />
    </Carousel>
  );
}

export default function HomePageTry(props) {
  const { id, data, data2, query } = props;
  const router = useRouter();
  const pageNumber = Number(query.page ?? 1);
  const items = [
    {
      src: "https://fastly.picsum.photos/id/13/2500/1667.jpg?hmac=SoX9UoHhN8HyklRA4A3vcCWJMVtiBXUg0W4ljWTor7s",
      altText: "Slide 1",
      caption: "Slide 1",
      header: "Slide 1 Header",
    },
    {
      src: "https://fastly.picsum.photos/id/17/2500/1667.jpg?hmac=HD-JrnNUZjFiP2UZQvWcKrgLoC_pc_ouUSWv8kHsJJY",
      altText: "Slide 2",
      caption: "Slide 2",
      header: "Slide 2 Header",
    },
    {
      src: "https://fastly.picsum.photos/id/11/2500/1667.jpg?hmac=xxjFJtAPgshYkysU_aqx2sZir-kIOjNR9vx0te7GycQ",
      altText: "Slide 3",
      caption: "Slide 3",
      header: "Slide 3 Header",
    },
  ];

  return (
    <div>
      <Container className="align-items-center justify-content-center">
        <div className="mt-3">
          <CarouselImages items={items} />
        </div>

        <div className="row">
          <h3 className="mt-5">Our Recommendation</h3>
          {data.data.map((item, index) => (
            <div key={index} className="mt-2 mb-4 col-lg-3 col-md-4 col-sm-6">
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
                  <Link href={`/places/${item.id}`} className="btn btn-primary">
                    See more
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row">
          <h3 className="mt-3">Our Most Reviewed Place</h3>
          {data.data2.map((item, index) => (
            <div key={index} className="mt-2 mb-4 col-lg-3 col-md-4 col-sm-6">
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
                  <Link href={`/places/${item.id}`} className="btn btn-primary">
                    See more
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
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
      `http://localhost:3000/api/paginate-recs-home`,
      {
        headers: {
          Authorization: `Bearer ${sessionData.user.token}`,
        },
        params: {
          page: query.page ?? 1,
        },
      }
    );
    const responseMRP = await axios.get(
      `http://localhost:3000/api/paginate-mrp-home`,
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
    const data2 = responseMRP.data;
    return {
      props: {
        data,
        data2,
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
