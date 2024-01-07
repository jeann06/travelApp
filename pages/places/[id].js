import fetcher from "@/utils/fetcher";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { Button, Card, CardBody, Col, Container, Input, Row } from "reactstrap";
import moment from "moment";
import { Star, ThumbsDown, ThumbsUp } from "react-feather";

import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from "reactstrap";
import UserProfile from "@/components/UserProfile";
import { useRouter } from "next/router";

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

export default function DetailPlacesPage(props) {
  const { id, data, data2, token } = props;
  const router = useRouter();
  const items = data.postDetails.map((item, index) => {
    return {
      src: `http://localhost:8080/uploads/post-details/${item.fileName}`,
      altText: "Slide 1",
      caption: item.fileName,
      key: index + 1,
    };
  });

  return (
    <div>
      <Container className="mb-5">
        <h1>{data.title}</h1>

        <CarouselImages items={items} />

        <div className="mt-3">
          <UserProfile
            profilePic={data.user.profileUrl}
            profileName={data.user.fullName}
            createdDate={data.createdDate}
          ></UserProfile>
        </div>

        <h2 className="mt-4">Detail</h2>
        <Card className="mt-2">
          <CardBody>
            <p>
              Description: <br></br>
              {data.description}
            </p>
            <p>Address: {data.address}</p>
            <p>City: {data.city}</p>
            <p>Parking: {data.parking}</p>
            <p>Opening Hour: {moment(data.openingHour).format("h:mm A")}</p>
            <p>Closing Hour: {moment(data.closingHour).format("h:mm A")}</p>
            <p>Phone Number: {data.phoneNumber}</p>
          </CardBody>
        </Card>

        <h2 className="mt-4">Review</h2>

        <div className="border p-3 my-3">
          <Input
            type="textarea"
            placeholder="Write a review..."
            style={{ resize: "none" }}
            rows="3"
          ></Input>
          <div className="d-flex mt-3">
            <Button color="primary" className=" ms-auto ">
              Submit
            </Button>
          </div>
        </div>

        {data2.map((item, index) => {
          return (
            <div key={index} className="border p-3">
              <UserProfile
                profilePic={data.user.profileUrl}
                profileName={data.user.fullName}
                createdDate={data.createdDate}
              ></UserProfile>
              <div className="" style={{ paddingLeft: "70px" }}>
                <div>
                  <Star color="yellow" fill="yellow" />
                  <Star color="yellow" fill="yellow" />
                  <Star color="yellow" fill="yellow" />
                  <Star color="yellow" fill="yellow" />
                  <Star color="yellow" fill="yellow" />
                </div>
                <div className="">{item.description}</div>
                {item.reviewDetails.map((item2, index2) => {
                  return (
                    <img
                      src={`http://localhost:8080/uploads/review-details/${item2.fileName}`}
                      width={200}
                      height={200}
                      className="object-fit-cover me-2"
                    />
                  );
                })}

                <div className="d-flex gap-5">
                  <div className="mt-3 fs-5">{item.likes} Likes</div>
                  <div className="mt-3 fs-5">0 Dislikes</div>
                </div>

                <div className="d-flex gap-3">
                  <Button
                    color="primary"
                    className="mt-2 d-flex justify-content-center align-items-center"
                    onClick={async () => {
                      const response = await fetcher.post(
                        `/review/like/${item.id}`,
                        undefined,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );

                      router.reload();
                    }}
                  >
                    <ThumbsUp className="me-2" size={20}></ThumbsUp>
                    Likes
                  </Button>

                  <Button
                    color="danger"
                    className="mt-2 d-flex justify-content-center align-items-center"
                  >
                    <ThumbsDown className="me-2" size={20}></ThumbsDown>
                    Dislikes
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
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
    const responseReview = await fetcher.post(
      `/review/get/${id}`,
      {
        field: "likes",
        direction: "ASC",
      },
      {
        headers: {
          Authorization: `Bearer ${sessionData.user.token}`,
        },
      }
    );
    const data = response.data.data;
    const data2 = responseReview.data.data;
    return {
      props: {
        id,
        data,
        data2,
        token: sessionData.user.token,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
}
