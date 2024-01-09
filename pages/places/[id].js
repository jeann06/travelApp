import fetcher from "@/utils/fetcher";
import { getSession, useSession } from "next-auth/react";
import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import moment from "moment";
import { Star, ThumbsDown, ThumbsUp } from "react-feather";
import { Formik, Form as FormikForm } from "formik";

import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from "reactstrap";
import UserProfile from "@/components/UserProfile";
import { useRouter } from "next/router";
import * as yup from "yup";
import { DebugFormik } from "@/components/DebugFormik";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

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
  const { data: session, status } = useSession();
  const items = data.postDetails.map((item, index) => {
    return {
      src: `http://localhost:8080/uploads/post-details/${item.fileName}`,
      altText: "Slide 1",
      caption: item.fileName,
      key: index + 1,
    };
  });
  const [previewImages, setPreviewImages] = useState([]);

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
        <Formik
          initialValues={{
            files: [],
            rating: "",
            description: "",
          }}
          validationSchema={yup.object().shape({
            // files: yup.array().required("Images is required"),
            rating: yup.string().required("Rating is required"),
            description: yup.string().required("Description is required"),
          })}
          onSubmit={async (values, actions) => {
            const { files, ...rest } = values;

            const formData = new FormData();
            files.forEach((file, index) => {
              formData.append("files", file);
            });

            formData.append("data", JSON.stringify(rest));
            try {
              const response = await fetcher.post(
                `/review/post/${id}`,
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${session.user.token}`,
                  },
                }
              );

              MySwal.fire({
                icon: "success",
                title: <p>Review has successfully added!</p>,
                showConfirmButton: true,
                showDenyButton: false,
              }).then(() => {
                router.reload();
              });
            } catch (error) {
              console.error(error);
              MySwal.fire({
                icon: "error",
                title: <p>Something went wrong!</p>,
                showConfirmButton: true,
                showDenyButton: false,
              });
            }
          }}
        >
          {(formik) => (
            <FormikForm className="border p-3 my-3">
              <DebugFormik />
              <Row>
                <FormGroup tag={Col}>
                  <Input
                    id="rating"
                    name="rating"
                    placeholder="Rating"
                    type="text"
                    value={formik.values.rating}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={formik.errors.rating && formik.touched.rating}
                  />
                  <FormFeedback>{formik.errors.rating}</FormFeedback>
                </FormGroup>
              </Row>

              <Row>
                <FormGroup tag={Col}>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Write your review.."
                    type="textarea"
                    style={{ resize: "none" }}
                    rows="3"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.errors.description && formik.touched.description
                    }
                  />
                  <FormFeedback>{formik.errors.description}</FormFeedback>
                </FormGroup>
              </Row>

              <Row>
                <Col>
                  <FormGroup>
                    <label>
                      <input
                        type="file"
                        multiple
                        hidden
                        onChange={(e) => {
                          if (!e.target.files || e.target.files.length === 0) {
                            return;
                          }

                          const files = e.target.files;

                          if (files.length > 5) {
                            formik.setFieldError("files", "Maximum 5");
                            return;
                          }
                          formik.setFieldValue("files", Array.from(files));
                          setPreviewImages(
                            Array.from(files).map((file) =>
                              URL.createObjectURL(file)
                            )
                          );
                        }}
                      />

                      <div>
                        {previewImages.length > 0 ? (
                          <div>
                            {previewImages.map((file, index) => (
                              <img
                                key={index}
                                src={file}
                                className="object-fit-cover border rounded"
                                width="150px"
                                height="150px"
                                alt=""
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="d-flex">
                            <span className="btn btn-light border justify-content-center align-items-center">
                              Add Image
                            </span>
                          </div>
                        )}
                      </div>
                    </label>
                    <Input className="d-none" invalid={formik.errors.files} />
                    <FormFeedback>{formik.errors.files}</FormFeedback>
                  </FormGroup>
                </Col>
              </Row>

              <div className="d-flex mt-1">
                <Button
                  type="submit"
                  color="primary"
                  className=" ms-auto "
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </FormikForm>
          )}
        </Formik>

        {data2.content.map((item, index) => {
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
                    {item.likes} Likes
                  </Button>

                  <Button
                    color="danger"
                    className="mt-2 d-flex justify-content-center align-items-center"
                    onClick={async () => {
                      const response = await fetcher.post(
                        `/review/dislike/${item.id}`,
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
  const { params } = ctx;

  const id = params.id;
  const response = await fetcher.get(`/post/get/${id}`);
  const responseReview = await fetcher.get(
    `/review/get/${id}?sortBy=createdDate&sortDir=desc&page=0&size=5`
  );
  const data = response.data.data;
  const data2 = responseReview.data.data;
  return {
    props: {
      id,
      data,
      data2,
    },
  };
}
