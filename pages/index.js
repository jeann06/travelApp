// import { getSession, useSession } from "next-auth/react";
// import { useState } from "react";
// import ReactPaginate from "react-paginate";
// import {
//   Carousel,
//   CarouselItem,
//   CarouselControl,
//   CarouselIndicators,
//   CarouselCaption,
//   Container,
// } from "reactstrap";

// function CarouselImages({ items }) {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [animating, setAnimating] = useState(false);

//   const next = () => {
//     if (animating) return;
//     const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
//     setActiveIndex(nextIndex);
//   };

//   const previous = () => {
//     if (animating) return;
//     const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
//     setActiveIndex(nextIndex);
//   };

//   const goToIndex = (newIndex) => {
//     if (animating) return;
//     setActiveIndex(newIndex);
//   };

//   const slides = items.map((item) => {
//     return (
//       <CarouselItem
//         onExiting={() => setAnimating(true)}
//         onExited={() => setAnimating(false)}
//         key={item.src}
//       >
//         <img
//           src={item.src}
//           className="object-fit-cover"
//           width={1600}
//           height={400}
//           alt={item.altText}
//         />
//         {/* <CarouselCaption
//           captionText={item.caption}
//           captionHeader={item.caption}
//         /> */}
//       </CarouselItem>
//     );
//   });

//   return (
//     <Carousel activeIndex={activeIndex} next={next} previous={previous}>
//       <CarouselIndicators
//         items={items}
//         activeIndex={activeIndex}
//         onClickHandler={goToIndex}
//       />
//       {slides}
//       <CarouselControl
//         direction="prev"
//         directionText="Previous"
//         onClickHandler={previous}
//       />
//       <CarouselControl
//         direction="next"
//         directionText="Next"
//         onClickHandler={next}
//       />
//     </Carousel>
//   );
// }

// export default function HomePage(props) {
//   const { id, data, query } = props;
//   const { data: session, status } = useSession();
//   if (status == "authenticated") {
//     console.log(session);
//   }
//   const items = [
//     {
//       src: "https://fastly.picsum.photos/id/13/2500/1667.jpg?hmac=SoX9UoHhN8HyklRA4A3vcCWJMVtiBXUg0W4ljWTor7s",
//       altText: "Slide 1",
//       caption: "Slide 1",
//       header: "Slide 1 Header",
//     },
//     {
//       src: "https://fastly.picsum.photos/id/17/2500/1667.jpg?hmac=HD-JrnNUZjFiP2UZQvWcKrgLoC_pc_ouUSWv8kHsJJY",
//       altText: "Slide 2",
//       caption: "Slide 2",
//       header: "Slide 2 Header",
//     },
//     {
//       src: "https://fastly.picsum.photos/id/11/2500/1667.jpg?hmac=xxjFJtAPgshYkysU_aqx2sZir-kIOjNR9vx0te7GycQ",
//       altText: "Slide 3",
//       caption: "Slide 3",
//       header: "Slide 3 Header",
//     },
//   ];

//   return (
//     <div>
//       <Container className="mb-5">
//         <CarouselImages items={items} />

//         <div className="mt-5">
//           <h3>Our Recommendation</h3>
//         </div>
//       </Container>
//     </div>
//   );
// }

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

export default function HomePage(props) {
  const { data, data2 } = props;
  const router = useRouter();
  console.log(data, "DATA@@");
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
        <h3 className="mt-5">Our Recommendation</h3>
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-5">
          {data.content.map((item, index) => (
            <div key={index} className="col mb-3">
              <div className="card">
                <img
                  src={`http://localhost:8080/${item.fileUrl}`}
                  class="card-img-top object-fit-cover"
                  width={150}
                  height={225}
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

        <h3 className="mt-5">Our Most Reviewed Places</h3>
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-5">
          {data2.content.map((item, index) => (
            <div key={index} className="col mb-3">
              <div className="card">
                <img
                  src={`http://localhost:8080/${item.fileUrl}`}
                  class="card-img-top object-fit-cover"
                  width={150}
                  height={225}
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
  const response = await fetcher.post(
    `/post/search?sortBy=rating&sortDir=desc&page=0&size=5`,
    {}
  );

  const response2 = await fetcher.post(
    `/post/search?sortBy=rating&sortDir=asc&page=0&size=5`,
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
