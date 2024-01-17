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
import { MapPin, Star } from "react-feather";
import GetUserLocation from "@/components/GetUserLocation";

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

export default function HomePage(props) {
  const { data, data2 } = props;
  const router = useRouter();
  const items = [
    {
      src: "https://pik2.com/storage/images/sliders/thumb-1080-f954c10e611c5db66ea9bc951e84fe33.jpg",
      altText: "Slide 1",
      caption: "Slide 1",
      header: "Slide 1 Header",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Jakarta_Skyline_Part_2.jpg/1200px-Jakarta_Skyline_Part_2.jpg",
      altText: "Slide 2",
      caption: "Slide 2",
      header: "Slide 2 Header",
    },
    {
      src: "https://storage.googleapis.com/flip-prod-mktg-strapi/media-library/jakarta_9794088ba9/jakarta_9794088ba9.jpg",
      altText: "Slide 3",
      caption: "Slide 3",
      header: "Slide 3 Header",
    },
  ];

  return (
    <div>
      <GetUserLocation />
      <Container className="align-items-center justify-content-center">
        <div className="mt-3">
          <CarouselImages items={items} />
        </div>
        <h3 className="mt-5 mb-3">Our Recommendation</h3>
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-5">
          {data.content.map((item, index) => (
            <div key={index} className="col mb-4">
              <Link
                style={{ textDecoration: "none" }}
                href={`/places/${item.id}`}
              >
                <div className="card">
                  <img
                    src={`http://localhost:8080/${item.fileUrl}`}
                    class="card-img-top object-fit-cover"
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

        <h3 className="mt-4 mb-3">Most Reviewed Places This Month</h3>
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-5">
          {data2.content.map((item, index) => (
            <div key={index} className="col mb-4">
              <Link
                style={{ textDecoration: "none" }}
                href={`/places/${item.id}`}
              >
                <div className="card" style={{ height: "100%" }}>
                  <img
                    src={`http://localhost:8080/${item.fileUrl}`}
                    class="card-img-top object-fit-cover"
                    width={150}
                    height={180}
                    alt=""
                  />
                  <div className="card-body">
                    <h6
                      className="card-title"
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        WebkitLineClamp: 2, // Limit to 2 lines
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.title}
                    </h6>
                    <span
                      className="border border-1 rounded px-2 py-1 mb-3"
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

                    <br />
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
      </Container>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const response = await fetcher.post(
    `/post/search?sortBy=rating&sortDir=desc&page=0&size=5`,
    {}
  );

  const response2 = await fetcher.post(
    `/post/search?sortBy=reviews&sortDir=desc&page=0&size=5`,
    {}
  );
  const data = response.data.data;
  const data2 = response2.data.data;

  return {
    props: {
      data,
      data2,
    },
  };
}
