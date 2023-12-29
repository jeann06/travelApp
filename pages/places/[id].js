import fetcher from "@/utils/fetcher";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import moment from "moment";

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
        <CarouselCaption
          captionText={item.caption}
          captionHeader={item.caption}
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

export default function DetailPlacesPage(props) {
  const { id, data } = props;

  const items = data.postDetails.map((item, index) => {
    return {
      src: `https://picsum.photos/id/${123 + index + 1}/2000/1500`,
      // src: "../../TravelApp/uploads/post-details/asdfasdfa_1.jpg",
      altText: "Slide 1",
      caption: item.fileName,
      key: index + 1,
    };
  });

  return (
    <div>
      <Container>
        <h1>{data.title}</h1>

        <CarouselImages items={items} />

        <div className="d-flex align-items-center mt-3">
          <div
            style={{
              width: "55px",
              height: "55px",
            }}
          >
            <img
              src="https://api.dicebear.com/7.x/fun-emoji/svg?seed=Abby"
              className="object-fit-cover rounded-circle"
            />
          </div>
          <div className="ms-3">
            <div>{data.user.fullName}</div>
            <div>
              Posted on {moment(data.createdDate).format("DD MMMM YYYY h:mm A")}
            </div>
          </div>
        </div>

        <h2 className="mt-4">Detail</h2>
        <Card className="mt-2">
          <CardBody>
            <p>City: {data.city}</p>
            <p>Address: {data.address}</p>
            <p>Description: {data.description}</p>
          </CardBody>
        </Card>
      </Container>
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

  const id = params.id;
  try {
    const response = await fetcher.get(`/post/get/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionData.user.token}`,
      },
    });
    const data = response.data.data;
    return {
      props: {
        id,
        data,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
