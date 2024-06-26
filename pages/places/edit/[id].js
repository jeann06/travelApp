import { DebugFormik } from "@/components/DebugFormik";
import fetcher from "@/utils/fetcher";
import { Formik, Form as FormikForm } from "formik";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Fragment, useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import {
  Button,
  Col,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import * as yup from "yup";
import Select from "react-select";
import Lightbox from "yet-another-react-lightbox";
import dynamic from "next/dynamic";
import GetUserLocation from "@/components/GetUserLocation";
import moment from "moment";
import { PlusCircle, Trash2 } from "react-feather";
import { successAlertNotification } from "@/components/alert/Alert";

const MapWithNoSSR = dynamic(() => import("../../../components/Maps/Map"), {
  ssr: false,
});
const MySwal = withReactContent(Swal);

const LightboxImage = ({ images }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="d-flex flex-wrap gap-1">
        {images.map((file, index) => (
          <img
            key={index}
            src={file}
            className="object-fit-cover border rounded"
            width={100}
            height={100}
            alt=""
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
          />
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={images.map((file, index) => ({
          src: file,
        }))}
      />
    </>
  );
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function EditPlacePage(props) {
  const { dataCategory, data, id } = props;
  const [images, setImages] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  const categoryOptions = useMemo(() => {
    return dataCategory.map((item, index) => {
      return {
        value: item.id,
        label: item.category,
      };
    });
  }, []);

  useEffect(() => {
    let isFetching = false;

    async function fetchImagesFromServer() {
      for (let i = 0; i < data.postDetails.length; i++) {
        const item = data.postDetails[i];
        const destinationPath = `/${item.url}${item.fileName}`; // /uploads/post_details/Testing_0.jpg

        const blobResponse = await fetcher.get(destinationPath, {
          responseType: "blob",
        });
        const blob = blobResponse.data;

        const file = new File([blob], item.fileName, { type: blob.type });

        if (!isFetching) {
          setImages((prev) => [...prev, file]);
        }
      }
    }

    if (images.length > 0) {
      return;
    }

    fetchImagesFromServer();

    return () => {
      isFetching = true;
    };
  }, []);

  return (
    <div style={{ backgroundColor: "#f0f0f0", flex: 1 }}>
      <div className="container py-5">
        <div className="card mx-auto" style={{ maxWidth: "800px" }}>
          <div className="card-body py-4">
            <h4 className="text-center mb-4">Edit Place</h4>
            <Formik
              enableReinitialize
              initialValues={{
                files: images || [],
                title: data.title,
                description: data.description,
                city: data.city,
                category: data.category,
                address: data.address,
                parking: data.parking,
                openingHour: data.openingHour
                  .split(",")
                  .map((nullOrDate) =>
                    nullOrDate == "null" ? null : moment(nullOrDate).toDate()
                  ),
                closingHour: data.closingHour
                  .split(",")
                  .map((nullOrDate) =>
                    nullOrDate == "null" ? null : moment(nullOrDate).toDate()
                  ),
                phoneNumber: data.phoneNumber,
                latitude: data.latitude,
                longitude: data.longitude,
              }}
              validationSchema={yup.object().shape({
                files: yup.array().required("Images is required"),
                // title: yup.string().required("Place Name is required"),
                description: yup.string().required("Description is required"),
                city: yup.string().required("City is required"),
                category: yup
                  .object({
                    id: yup.number(),
                    category: yup.string(),
                  })
                  .required("Category is required"),
                address: yup.string().required("Address is required"),
                parking: yup.string().optional(),
                // openingHour: yup.string().required("Opening Hour is required"),
                // closingHour: yup.string().required("Closing Hour is required"),
              })}
              onSubmit={async (values, actions) => {
                const { files, ...rest } = values;

                const formData = new FormData();
                files.forEach((file, index) => {
                  formData.append("files", file);
                });
                formData.append(
                  "data",
                  JSON.stringify({
                    ...rest,
                    openingHour: rest.openingHour
                      .map((el) => el || "null")
                      .join(","),
                    closingHour: rest.closingHour
                      .map((el) => el || "null")
                      .join(","),
                  })
                );

                try {
                  const response = await fetcher.put(
                    `/post/edit/${props.id}`,
                    formData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${session.user.token}`,
                      },
                    }
                  );

                  if (response.data.responseSchema.status === "Error") {
                    if (
                      typeof response.data.responseSchema.message === "string"
                    ) {
                      if (
                        response.data.responseSchema.message ===
                        "Duplicate Title"
                      ) {
                        actions.setFieldError(
                          "title",
                          response.data.responseSchema.message
                        );
                      }

                      return MySwal.fire({
                        icon: "error",
                        title: <p>{response.data.responseSchema.message}</p>,
                        showConfirmButton: true,
                        showDenyButton: false,
                      });
                    } else {
                      return MySwal.fire({
                        icon: "error",
                        title: <p>BE Error - But not of string type</p>,
                        showConfirmButton: true,
                        showDenyButton: false,
                      });
                    }
                  }

                  const id = response.data.data.id;

                  successAlertNotification(
                    "Success",
                    "Place has successfully edited!"
                  ).then(() => {
                    router.push(`/places/${id}`);
                  });
                } catch (error) {
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
                  <div className="px-4">
                    <Row>
                      <Col md={{ size: 12 }}>
                        <div className="d-flex flex-wrap gap-1">
                          {formik.values.files.map((file, index) => (
                            <div
                              className="position-relative"
                              style={{
                                width: 100,
                                height: 100,
                              }}
                            >
                              <img
                                key={index}
                                src={URL.createObjectURL(file)}
                                className="d-block object-fit-cover border rounded w-100 h-100"
                                alt=""
                              />

                              <button
                                className="btn btn-sm btn-danger position-absolute bottom-0 end-0"
                                onClick={(e) => {
                                  e.preventDefault();
                                  formik.setFieldValue(
                                    "files",
                                    formik.values.files.filter(
                                      (item, i) => i !== index
                                    )
                                  );
                                }}
                              >
                                <Trash2 size="1rem" />
                              </button>
                            </div>
                          ))}

                          {formik.values.files.length < 5 && (
                            <div>
                              <label
                                htmlFor="files"
                                className="d-block bg-light rounded border d-flex justify-content-center align-items-center"
                                style={{
                                  width: 100,
                                  height: 100,
                                  cursor: "pointer",
                                }}
                              >
                                <PlusCircle size={30} />
                              </label>
                              <input
                                type="file"
                                multiple
                                hidden
                                id="files"
                                onChange={(e) => {
                                  if (
                                    !e.target.files ||
                                    e.target.files.length === 0
                                  ) {
                                    return;
                                  }

                                  const files = e.target.files;

                                  if (
                                    files.length >
                                    5 - formik.values.files.length
                                  ) {
                                    formik.setFieldError("files", "Maximum 5");
                                    return;
                                  }

                                  formik.setFieldValue("files", [
                                    ...formik.values.files,
                                    ...Array.from(files),
                                  ]);
                                }}
                              />
                            </div>
                          )}
                        </div>

                        <label
                          className="d-block btn btn-primary mt-2"
                          htmlFor="changeAllImage"
                        >
                          Change All Image
                        </label>
                        <input
                          id="changeAllImage"
                          type="file"
                          multiple
                          hidden
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
                          }}
                        />

                        {formik.errors.files && (
                          <div className="text-danger">
                            {formik.errors.files}
                          </div>
                        )}
                      </Col>
                    </Row>

                    <Row>
                      <FormGroup tag={Col} md={{ size: 12 }}>
                        <Label for="title">Place Name</Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="Place Name"
                          type="text"
                          value={formik.values.title}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          invalid={formik.errors.title && formik.touched.title}
                          disabled
                        />
                        <FormFeedback>{formik.errors.title}</FormFeedback>
                      </FormGroup>
                    </Row>

                    <Row>
                      <FormGroup tag={Col} md={{ size: 12 }}>
                        <Label for="description">Description</Label>
                        <Input
                          id="description"
                          name="description"
                          placeholder="Description"
                          type="textarea"
                          style={{ resize: "none", height: "150px" }}
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

                    <Row>
                      <FormGroup tag={Col} md={{ size: 12 }}>
                        <div
                          id="map"
                          style={{
                            height: 300,
                          }}
                        >
                          <MapWithNoSSR
                            position={[data.latitude, data.longitude]}
                            zoom={18}
                            onClickMap={(latLng) => {
                              formik.setFieldValue("longitude", latLng.lng);
                              formik.setFieldValue("latitude", latLng.lat);
                            }}
                          />
                        </div>
                      </FormGroup>
                    </Row>

                    <Row>
                      <FormGroup tag={Col} md={{ size: 12 }}>
                        <Label for="address">Address</Label>
                        <Input
                          id="address"
                          name="address"
                          placeholder="Address"
                          type="textarea"
                          style={{ resize: "none", height: "100px" }}
                          value={formik.values.address}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          invalid={
                            formik.errors.address && formik.touched.address
                          }
                        />
                        <FormFeedback>{formik.errors.address}</FormFeedback>
                      </FormGroup>
                    </Row>

                    <Row>
                      <FormGroup tag={Col} md={{ size: 12 }}>
                        <Label for="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          type="select"
                          value={formik.values.city}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          invalid={formik.errors.city && formik.touched.city}
                        >
                          <option hidden disabled value="">
                            Please select a city
                          </option>
                          <option>Jakarta Timur</option>
                          <option>Jakarta Utara</option>
                          <option>Jakarta Pusat</option>
                          <option>Jakarta Selatan</option>
                          <option>Jakarta Barat</option>
                        </Input>
                        <FormFeedback>{formik.errors.city}</FormFeedback>
                      </FormGroup>
                    </Row>

                    <Row>
                      <FormGroup tag={Col} md={{ size: 12 }}>
                        <Label for="category">Category</Label>

                        <Select
                          instanceId="category"
                          placeholder="Please select category"
                          value={
                            formik.values.category
                              ? {
                                  value: formik.values.category.id,
                                  label: formik.values.category.category,
                                }
                              : null
                          }
                          options={categoryOptions}
                          onChange={(option) =>
                            formik.setFieldValue("category", {
                              id: option.value,
                              category: option.label,
                            })
                          }
                          onBlur={() => {
                            formik.setFieldTouched("category");
                          }}
                          className={`${
                            formik.touched.category && formik.errors.category
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        <FormFeedback>{formik.errors.category}</FormFeedback>
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup tag={Col} md={{ size: 12 }}>
                        <Label for="parking">Parking</Label>
                        <Input
                          id="parking"
                          name="parking"
                          type="select"
                          value={formik.values.parking}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          invalid={
                            formik.errors.parking && formik.touched.parking
                          }
                        >
                          <option hidden disabled value="">
                            Please select parking
                          </option>
                          <option>None</option>
                          <option>Small</option>
                          <option>Medium</option>
                          <option>Large</option>
                        </Input>
                        <FormFeedback>{formik.errors.parking}</FormFeedback>
                      </FormGroup>
                    </Row>

                    <Row>
                      <Col md={{ size: 12 }}>
                        <strong>Select business hours</strong>

                        <div className="d-flex gap-2 my-3">
                          {days.map((day, index) => (
                            <div>
                              <input
                                type="checkbox"
                                className="btn-check"
                                id={day}
                                autocomplete="off"
                                checked={!!formik.values.openingHour[index]}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    formik.setFieldValue(
                                      `openingHour[${index}]`,
                                      moment(new Date())
                                        .set("hours", 10) // set jam 10
                                        .set("minutes", 0) // set menit 0
                                        .set("seconds", 0) // set detik 0
                                        .toDate()
                                    );
                                    formik.setFieldValue(
                                      `closingHour[${index}]`,
                                      moment(new Date())
                                        .set("hours", 10)
                                        .set("minutes", 0)
                                        .set("seconds", 0)
                                        .add(7, "hours") // ditambah 7 jam
                                        .toDate()
                                    );
                                  } else {
                                    formik.setFieldValue(
                                      `openingHour[${index}]`,
                                      null
                                    );
                                    formik.setFieldValue(
                                      `closingHour[${index}]`,
                                      null
                                    );
                                  }
                                }}
                              />
                              <label
                                className="btn btn-outline-primary"
                                htmlFor={day}
                              >
                                {day}
                              </label>
                            </div>
                          ))}
                        </div>

                        <div className="card ">
                          <div className="card-body p-0">
                            <table className="table align-middle table-borderless rounded overflow-hidden">
                              <thead className="table-light">
                                <tr className="border-bottom">
                                  <th scope="col">Day</th>
                                  <th scope="col">Start Time</th>
                                  <th scope="col">End Time</th>
                                  <th scope="col">Total Hours</th>
                                </tr>
                              </thead>
                              <tbody>
                                {formik.values.openingHour.some((a) => !!a) ? (
                                  formik.values.openingHour.map((el, index) => (
                                    <Fragment key={index}>
                                      {el && (
                                        <tr>
                                          <td>{days[index]}</td>
                                          <td>
                                            <input
                                              type="time"
                                              className="form-control"
                                              style={{
                                                width: "fit-content",
                                              }}
                                              value={moment(
                                                formik.values.openingHour[index]
                                              ).format("HH:mm")}
                                              onChange={(e) => {
                                                formik.setFieldValue(
                                                  `openingHour[${index}]`,
                                                  moment(
                                                    e.target.value,
                                                    "HH:mm"
                                                  ).toDate()
                                                );
                                              }}
                                            />
                                          </td>
                                          <td>
                                            <input
                                              type="time"
                                              className="form-control"
                                              style={{
                                                width: "fit-content",
                                              }}
                                              value={moment(
                                                formik.values.closingHour[index]
                                              ).format("HH:mm")}
                                              onChange={(e) => {
                                                formik.setFieldValue(
                                                  `closingHour[${index}]`,
                                                  moment(
                                                    e.target.value,
                                                    "HH:mm"
                                                  ).toDate()
                                                );
                                              }}
                                            />
                                          </td>
                                          <td>
                                            {moment(
                                              formik.values.closingHour[index]
                                            ).diff(
                                              moment(
                                                formik.values.openingHour[index]
                                              ),
                                              "hours"
                                            )}{" "}
                                            hours
                                          </td>
                                        </tr>
                                      )}
                                    </Fragment>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={4} className="text-center">
                                      Please select business hours
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <FormGroup tag={Col} md={{ size: 12 }}>
                        <Label for="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          placeholder="Phone Number"
                          type="text"
                          style={{ resize: "none" }}
                          value={formik.values.phoneNumber}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          invalid={
                            formik.errors.phoneNumber &&
                            formik.touched.phoneNumber
                          }
                        />
                        <FormFeedback>{formik.errors.phoneNumber}</FormFeedback>
                      </FormGroup>
                    </Row>
                    <div className="mt-2">
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
                </FormikForm>
              )}
            </Formik>
          </div>
        </div>
      </div>
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
    const { params } = ctx;
    const id = params.id;
    const responseCategory = await fetcher.get(`/category/getAll`, {
      headers: {
        Authorization: `Bearer ${sessionData.user.token}`,
      },
    });
    const response = await fetcher.get(`/post/get/${id}`);
    const dataCategory = responseCategory.data.data;
    const data = response.data.data;
    return {
      props: {
        dataCategory,
        data,
        id,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
