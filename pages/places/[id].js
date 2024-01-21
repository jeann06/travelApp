import fetcher from "@/utils/fetcher";
import { getSession, signIn, useSession } from "next-auth/react";
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
  Form,
} from "reactstrap";
import moment from "moment";
import { MoreVertical, Star, ThumbsDown, ThumbsUp } from "react-feather";
import { Formik, Form as FormikForm } from "formik";

import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from "reactstrap";
import UserProfile from "@/components/UserProfile";
import UserProfilePost from "@/components/UserProfilePost";
import { useRouter } from "next/router";
import * as yup from "yup";
import { DebugFormik } from "@/components/DebugFormik";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Rating from "react-rating";
import PlacesImageGrid from "@/components/PlacesImageGrid";
import dynamic from "next/dynamic";
import Link from "next/link";
import { successAlertNotification } from "@/components/alert/Alert";

const ReviewDropdownAction = ({ review, session }) => {
  const [isDropdownReviewOpen, setIsDropdownReviewOpen] = useState(false);
  const router = useRouter();
  const toggleDropdownReview = () => {
    setIsDropdownReviewOpen(!isDropdownReviewOpen);
  };

  return (
    <Dropdown
      className=""
      isOpen={isDropdownReviewOpen}
      toggle={toggleDropdownReview}
    >
      <DropdownToggle caret={false} color="none" className="">
        <MoreVertical />
      </DropdownToggle>
      <DropdownMenu className="mt-1 ms-3" style={{ minWidth: "100px" }}>
        <DropdownItem>Report Review</DropdownItem>
        {session?.user?.username === review.user.username && (
          <>
            <DropdownItem>Edit Review</DropdownItem>
            <DropdownItem
              onClick={async () => {
                const response = await fetcher.delete(
                  `/review/delete/${review.id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${session.user.token}`,
                    },
                  }
                );

                router.reload();
              }}
            >
              Delete Review
            </DropdownItem>
          </>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

const MapWithNoSSR = dynamic(() => import("../../components/Maps/Map"), {
  ssr: false,
});

const MySwal = withReactContent(Swal);

const BusinessHourList = ({ openingHour, closingHour }) => {
  const openingHours = openingHour
    .split(",")
    .map((nullOrDate) =>
      nullOrDate == "null" ? "N/A" : moment(nullOrDate).format("HH:mm")
    );
  const closingHours = closingHour
    .split(",")
    .map((nullOrDate) =>
      nullOrDate == "null" ? "N/A" : moment(nullOrDate).format("HH:mm")
    );

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <ul>
      {openingHours.map((openHour, index) => (
        <li key={index}>
          <span className="fw-semibold">{days[index]}:</span> {openHour} -{" "}
          {closingHours[index]}
        </li>
      ))}
    </ul>
  );
};

export default function DetailPlacesPage(props) {
  const { id, data, data2 } = props;
  const router = useRouter();
  console.log(data, "DATA!!!");
  const { data: session, status } = useSession();
  const items = data.postDetails.map((item, index) => {
    return {
      src: `${process.env.NEXT_PUBLIC_API_URL}/uploads/post-details/${item.fileName}`,
      alt: item.fileName,
    };
  });

  const [previewImages, setPreviewImages] = useState([]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [isModalReportOpen, setIsModalReportOpen] = useState(false);
  const toggleModalReport = () => {
    setIsModalReportOpen(!isModalReportOpen);
  };

  const [isModalVerifyOpen, setIsModalVerifyOpen] = useState(false);
  const toggleModalVerify = () => {
    setIsModalVerifyOpen(!isModalVerifyOpen);
  };

  const [showOtherInput, setShowOtherInput] = useState(false);

  const radioOptions = [
    {
      id: "false-information",
      value: "This post contains false information",
    },
    {
      id: "offensive-content",
      value: "This post contains offensive content",
    },
  ];

  const [filterOpen, setFilterOpen] = useState(false);
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };
  const [selectedFilter, setSelectedFilter] = useState({
    sortBy: "createdDate",
    sortDir: "desc",
  });
  const handleFilterSelect = (filter, extraQuery = {}) => {
    setSelectedFilter(filter);
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: 0,
        sortBy: filter.sortBy,
        sortDir: filter.sortDir,
        ...extraQuery,
      },
    });
  };
  const getFilterLabel = (selectedFilter) => {
    if (
      selectedFilter.sortBy === "likes" &&
      selectedFilter.sortDir === "desc"
    ) {
      return "Most-Liked";
    } else if (
      selectedFilter.sortBy === "createdDate" &&
      selectedFilter.sortDir === "desc"
    ) {
      return "Newest";
    }
  };

  return (
    <div>
      <Container className="mb-5">
        <div className="d-flex mt-4 align-items-center justify-content-between">
          <h1>{data.title}</h1>
          <Dropdown
            className=""
            isOpen={isDropdownOpen}
            toggle={toggleDropdown}
          >
            <DropdownToggle caret={false} color="none" className="">
              <MoreVertical />
            </DropdownToggle>
            <DropdownMenu className="mt-1 ms-3" style={{ minWidth: "100px" }}>
              <DropdownItem onClick={toggleModalReport}>
                Report Place
              </DropdownItem>
              <DropdownItem onClick={toggleModalVerify}>
                Verify Place
              </DropdownItem>
              {session?.user?.username === data.user.username && (
                <>
                  <DropdownItem tag={Link} href={`/places/edit/${id}`}>
                    Edit Place
                  </DropdownItem>
                  <DropdownItem
                    onClick={async () => {
                      const response = await fetcher.delete(
                        `/post/delete/${id}`,
                        {
                          headers: {
                            Authorization: `Bearer ${session.user.token}`,
                          },
                        }
                      );

                      router.push("/places");
                    }}
                  >
                    Delete Place
                  </DropdownItem>
                </>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>

        <Modal isOpen={isModalReportOpen} toggle={toggleModalReport}>
          <ModalHeader toggle={toggleModalReport} className="text-center px-4">
            Report Place
          </ModalHeader>
          <ModalBody className="mb-3">
            <Formik
              initialValues={{
                message: "",
              }}
              validationSchema={yup.object().shape({
                message: yup.string().required("Reason is required"),
              })}
              onSubmit={async (values) => {
                try {
                  const response = await fetcher.post(
                    `/post/report/${id}`,
                    { message: values.message },
                    {
                      headers: {
                        Authorization: `Bearer ${session.user.token}`,
                      },
                    }
                  );
                  MySwal.fire({
                    icon: "success",
                    title: <p>Thank you for reporting!</p>,
                    showConfirmButton: true,
                    showDenyButton: false,
                  }).then(() => {
                    router.push(`/places/${id}`);
                    toggleModalReport();
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
                <FormikForm>
                  <div className="px-2 py-1">
                    <label
                      htmlFor="message"
                      className="fw-semibold mb-3"
                      style={{ fontSize: "20px" }}
                    >
                      Why you report this place?
                    </label>
                    {radioOptions.map((option, index) => (
                      <div className="form-check" key={index}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="message"
                          id={option.id}
                          value={option.value}
                          checked={formik.values.message === option.value}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <label
                          className="form-check-label mb-2"
                          htmlFor={option.id}
                        >
                          {option.value}
                        </label>
                      </div>
                    ))}
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="message"
                        id="others"
                        value=""
                        checked={
                          radioOptions.findIndex(
                            (option) => option.value === formik.values.message
                          ) === -1
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <label className="form-check-label" htmlFor="others">
                        Others
                      </label>
                      {radioOptions.findIndex(
                        (option) => option.value === formik.values.message
                      ) === -1 && (
                        <textarea
                          className="form-control mt-1"
                          name="message"
                          placeholder="Please specify"
                          rows="3"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{ resize: "none" }}
                        />
                      )}
                    </div>

                    <Input
                      hidden
                      invalid={
                        formik.touched.message && !!formik.errors.message
                      }
                    />
                    <FormFeedback className="ms-4">
                      {formik.errors.message}
                    </FormFeedback>
                  </div>

                  <div className="d-flex mt-2">
                    <Button
                      color="light"
                      className="ms-auto"
                      onClick={toggleModalReport}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      color="primary"
                      className="ms-3 me-2"
                      disabled={formik.isSubmitting}
                    >
                      {formik.isSubmitting ? (
                        <>
                          <Spinner size="sm" color="light" className="me-2" />
                          Submiting...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </div>
                </FormikForm>
              )}
            </Formik>
          </ModalBody>
        </Modal>

        <Modal isOpen={isModalVerifyOpen} toggle={toggleModalVerify}>
          <ModalHeader toggle={toggleModalVerify} className="text-center px-4">
            Verify Place
          </ModalHeader>
          <ModalBody className="mb-3">
            <Formik
              initialValues={{
                files: [],
                description: "",
              }}
              validationSchema={yup.object().shape({
                files: yup.array().required("Files is required"),
                description: yup.string().required("Description is required"),
              })}
              onSubmit={async (values, actions) => {
                const { files, ...rest } = values;
                console.log(values, "CEK VALUES!");
                const formData = new FormData();
                files.forEach((file, index) => {
                  formData.append("files", file);
                });

                formData.append("data", JSON.stringify(rest));
                try {
                  const response = await fetcher.post(
                    `/post/claim/${id}`,
                    formData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${session.user.token}`,
                      },
                    }
                  );

                  successAlertNotification(
                    "Success",
                    "You has successfully submitted your request!"
                  ).then(() => {
                    router.push(`/places/${id}`);
                    toggleModalVerify();
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
                <FormikForm>
                  <div className="px-2">
                    <Row>
                      <FormGroup
                        tag={Col}
                        md={{ size: 12 }}
                        className="text-center fw-semibold"
                        style={{ fontSize: "18px" }}
                      >
                        <Label for="proof">
                          Upload proof that showing you own this place
                        </Label>
                        <Input
                          className="form-control"
                          type="file"
                          id="proof"
                          multiple
                          onChange={(e) => {
                            if (
                              !e.target.files ||
                              e.target.files.length === 0
                            ) {
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
                          onBlur={formik.handleBlur}
                          invalid={formik.touched.files && formik.errors.files}
                        />
                        <FormFeedback>{formik.errors.files}</FormFeedback>
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup tag={Col} md={{ size: 12 }} className="">
                        <Label for="description">Description</Label>
                        <Input
                          className="form-control"
                          placeholder="Describe more about your proof..."
                          type="textarea"
                          id="description"
                          style={{ resize: "none", height: "100px" }}
                          value={formik.values.description}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          invalid={
                            formik.errors.description &&
                            formik.touched.description
                          }
                        />
                        <FormFeedback>{formik.errors.description}</FormFeedback>
                      </FormGroup>
                    </Row>
                    <div className="d-flex">
                      <div className="ms-auto">
                        <Button color="light" onClick={toggleModalVerify}>
                          Cancel
                        </Button>
                      </div>

                      <div style={{ width: "80px" }} className="ms-3">
                        <Button
                          block
                          type="submit"
                          color="primary"
                          disabled={formik.isSubmitting}
                        >
                          {formik.isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </FormikForm>
              )}
            </Formik>
          </ModalBody>
        </Modal>

        <div className="my-4">
          <PlacesImageGrid items={items} />
        </div>

        <div className="mt-3">
          <UserProfilePost
            profilePic={data.user.profileUrl}
            profileName={data.user.username}
            createdDate={data.createdDate}
            creator={data.creator.username}
            modifiedDate={data.modifiedDate}
          ></UserProfilePost>
        </div>

        <Card className="mt-4">
          <CardBody>
            <p>
              <span className="fw-semibold">Description:</span>
              <br />
              {data.description}
            </p>
          </CardBody>
        </Card>

        <div className="d-flex mt-3 justify-content-between">
          <Card className="" style={{ width: "600px" }}>
            <CardBody>
              <p>
                <span className="fw-semibold">Category: </span>
                {data.category.category}
              </p>
              <span>
                <span className="fw-semibold">Business Hour:</span>

                <BusinessHourList
                  openingHour={data.openingHour}
                  closingHour={data.closingHour}
                />
              </span>
              <p>
                <span className="fw-semibold">Parking: </span>
                {data.parking}
              </p>
              <p>
                <span className="fw-semibold">Phone Number: </span>
                {data.phoneNumber}
              </p>
            </CardBody>
          </Card>
          <Card className="" style={{ width: "650px" }}>
            <CardBody>
              <div
                id="map"
                className="mb-3"
                style={{
                  height: 200,
                }}
              >
                <MapWithNoSSR
                  position={[data.latitude, data.longitude]}
                  zoom={18}
                  isDisabled
                />
              </div>
              <p>
                <span className="fw-semibold">Address:</span>
                <br />
                {data.address}
              </p>
              <p>
                <span className="fw-semibold">City: </span>
                {data.city}
              </p>
            </CardBody>
          </Card>
        </div>

        <h2 className="mt-4">Review</h2>

        {status === "authenticated" ? (
          <Formik
            initialValues={{
              files: [],
              rating: "",
              description: "",
            }}
            validationSchema={yup.object().shape({
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
                <Row>
                  <FormGroup tag={Col}>
                    <Rating
                      id="rating"
                      name="rating"
                      initialRating={formik.values.rating}
                      onChange={(value) =>
                        formik.setFieldValue("rating", value)
                      }
                      emptySymbol={
                        <Star
                          color="#ffe234"
                          className="text-muted"
                          size={25}
                        />
                      }
                      fullSymbol={
                        <Star
                          color="#ffe234"
                          fill="#ffe234"
                          className="text-warning"
                          size={25}
                        />
                      }
                      onBlur={(e) => {
                        formik.setFieldTouched("rating");
                      }}
                    />
                    <Input
                      type="hidden"
                      invalid={formik.touched.rating && formik.errors.rating}
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
                            const files = e.target.files;

                            if (files.length > 5) {
                              formik.setFieldError("files", "Maximum 5");
                              return;
                            }

                            formik.setFieldValue("files", Array.from(files));
                            if (files.length > 0) {
                              setPreviewImages(
                                Array.from(files).map((file) =>
                                  URL.createObjectURL(file)
                                )
                              );
                            }
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
        ) : (
          <Button className="mb-3" onClick={() => signIn()}>
            Please sign in before writing a review
          </Button>
        )}
        <div className="d-flex">
          <Dropdown
            className="mt-4 mb-3"
            isOpen={filterOpen}
            toggle={toggleFilter}
          >
            <DropdownToggle
              caret
              color="light"
              className="border text-start align-caret-right"
              style={{ minWidth: "150px" }}
            >
              {getFilterLabel(selectedFilter)}
            </DropdownToggle>
            <DropdownMenu className="mt-1" style={{ minWidth: "150px" }}>
              <DropdownItem
                onClick={() =>
                  handleFilterSelect({
                    sortBy: "likes",
                    sortDir: "desc",
                  })
                }
              >
                Most-Liked
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  handleFilterSelect({
                    sortBy: "createdDate",
                    sortDir: "desc",
                  })
                }
              >
                Newest
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {data2.content.map((item, index) => {
          return (
            <div key={index} className="border p-3 mb-3">
              <div className="d-flex justify-content-between">
                <UserProfile
                  profilePic={item.user.profileUrl}
                  profileName={item.user.username}
                  createdDate={item.createdDate}
                ></UserProfile>
                <ReviewDropdownAction
                  review={item}
                  session={session}
                ></ReviewDropdownAction>
              </div>

              <div className="" style={{ paddingLeft: "70px" }}>
                <div>
                  <Rating
                    initialRating={item.rating}
                    emptySymbol={
                      <Star color="#ffe234" className="text-muted" size={20} />
                    }
                    fullSymbol={
                      <Star
                        color="#ffe234"
                        fill="#ffe234"
                        className="text-warning"
                        size={20}
                      />
                    }
                    readonly
                  />
                </div>
                <div className="mb-3 mt-1">{item.description}</div>
                {item.reviewDetails.map((item2, index2) => {
                  return (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/review-details/${item2.fileName}`}
                      width={150}
                      height={150}
                      className="object-fit-cover me-2 rounded"
                    />
                  );
                })}

                <div className="d-flex gap-3">
                  <Button
                    color={
                      item.likedUsers.find(
                        (user) => user.username === session?.user?.username
                      )
                        ? "primary"
                        : "none"
                    }
                    size="sm"
                    className="mt-2 d-flex justify-content-center align-items-center"
                    onClick={async () => {
                      const response = await fetcher.post(
                        `/review/like/${item.id}`,
                        undefined,
                        {
                          headers: {
                            Authorization: `Bearer ${session.user.token}`,
                          },
                        }
                      );

                      router.reload();
                    }}
                    style={{ border: "none" }}
                    disabled={status !== "authenticated"}
                  >
                    <ThumbsUp className="me-2" size={20}></ThumbsUp>
                    {item.likes}
                  </Button>

                  <Button
                    color="none"
                    size="sm"
                    className="mt-2"
                    onClick={async () => {
                      const response = await fetcher.post(
                        `/review/dislike/${item.id}`,
                        undefined,
                        {
                          headers: {
                            Authorization: `Bearer ${session.user.token}`,
                          },
                        }
                      );

                      router.reload();
                    }}
                    style={{ border: "none" }}
                    disabled={status !== "authenticated"}
                  >
                    <ThumbsDown className="me-2" size={20}></ThumbsDown>
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
  const query = ctx.query;
  const page = query.page ?? 0;
  const size = query.size ?? 10;
  const sortBy = query.sortBy ?? "createdDate";
  const sortDir = query.sortDir ?? "desc";
  const id = params.id;
  const response = await fetcher.get(`/post/get/${id}`);
  const responseReview = await fetcher.get(
    `/review/get/${id}?sortBy=${sortBy}&sortDir=${sortDir}&page=${page}&size=${size}`
  );
  const data = response.data.data;
  const data2 = responseReview.data.data;

  for (let i = 0; i < data2.content.length; i++) {
    const reviewId = data2.content[i].id;
    const responseLikedUsers = await fetcher.get(
      `/review/like/getUsers/${reviewId}`
    );
    const likedUsers = responseLikedUsers?.data?.data;
    data2.content[i].likedUsers = likedUsers;
  }
  return {
    props: {
      id,
      data,
      data2,
    },
  };
}
