import { DebugFormik } from "@/components/DebugFormik";
import fetcher from "@/utils/fetcher";
import { Formik, Form as FormikForm } from "formik";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
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

const MySwal = withReactContent(Swal);

export default function AddPlacePage(props) {
  const { dataCategory } = props;
  const categoryOptions = useMemo(() => {
    return dataCategory.map((item, index) => {
      return {
        value: item.id,
        label: item.category,
      };
    });
  }, []);
  const [previewImages, setPreviewImages] = useState([]);
  const router = useRouter();
  const { data: session, status } = useSession();
  console.log(session, "SESSIONNNNNNNNNN");
  return (
    <div className="container-fluid">
      <div className="card">
        <h4 className="text-center py-5">Suggest New Place</h4>
        <Formik
          initialValues={{
            files: [],
            title: "",
            description: "",
            city: "",
            category: null,
            address: "",
            parking: "",
            phoneNumber: "",
            openingHour: new Date(),
            closingHour: new Date(),
          }}
          validationSchema={yup.object().shape({
            // files: yup.array().required("Images is required"),
            title: yup.string().required("Place Name is required"),
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
            phoneNumber: yup.string().required("Phone Number is required"),
            openingHour: yup.string().required("Opening Hour is required"),
            closingHour: yup.string().required("Closing Hour is required"),
          })}
          onSubmit={async (values, actions) => {
            // do what you want to do with the values
            const { files, ...rest } = values;

            const formData = new FormData();
            files.forEach((file, index) => {
              formData.append("files", file);
            });

            formData.append("data", JSON.stringify(rest));
            try {
              const response = await fetcher.post("/post/create", formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${session.user.token}`,
                },
              });

              const id = response.data.data.id;

              MySwal.fire({
                icon: "success",
                title: <p>Place has successfully added!</p>,
                showConfirmButton: true,
                showDenyButton: false,
              }).then(() => {
                router.push(`/places/${id}`);
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
              {/* <DebugFormik /> */}
              <Row>
                <Col md={{ offset: 3, size: 6 }}>
                  <FormGroup>
                    <label className="d-block">
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

                      <div className="d-grid">
                        {previewImages.length > 0 ? (
                          <div className="row row-cols-2 row-cols-sm-3 row-cols-md-5">
                            {previewImages.map((file, index) => (
                              <div className="col" key={index}>
                                <img
                                  key={index}
                                  src={file}
                                  className="object-fit-cover border rounded"
                                  width={130}
                                  height={130}
                                  alt=""
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="btn btn-primary">Select Image</div>
                        )}
                      </div>
                    </label>
                    <Input className="d-none" invalid={formik.errors.files} />
                    <FormFeedback>{formik.errors.files}</FormFeedback>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <FormGroup tag={Col} md={{ offset: 3, size: 6 }}>
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
                  />
                  <FormFeedback>{formik.errors.title}</FormFeedback>
                </FormGroup>
              </Row>

              <Row>
                <FormGroup tag={Col} md={{ offset: 3, size: 6 }}>
                  <Label for="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Description"
                    type="textarea"
                    style={{ resize: "none" }}
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
                <FormGroup tag={Col} md={{ offset: 3, size: 6 }}>
                  <Label for="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Address"
                    type="textarea"
                    style={{ resize: "none" }}
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={formik.errors.address && formik.touched.address}
                  />
                  <FormFeedback>{formik.errors.address}</FormFeedback>
                </FormGroup>
              </Row>

              <Row>
                <FormGroup tag={Col} md={{ offset: 3, size: 6 }}>
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
                <FormGroup tag={Col} md={{ offset: 3, size: 6 }}>
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
                    onBlur={formik.handleBlur}
                    className={`${formik.errors.category ? "is-invalid" : ""}`}
                  />
                  <FormFeedback>{formik.errors.category}</FormFeedback>
                </FormGroup>
              </Row>
              <Row>
                <FormGroup tag={Col} md={{ offset: 3, size: 6 }}>
                  <Label for="parking">Parking</Label>
                  <Input
                    id="parking"
                    name="parking"
                    type="select"
                    value={formik.values.parking}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={formik.errors.parking && formik.touched.parking}
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
                <Col md={{ offset: 3, size: 6 }}>
                  <Row>
                    <FormGroup tag={Col} md={{ size: 6 }}>
                      <Label for="openingHour">Opening Hour</Label>
                      <br></br>
                      <DatePicker
                        selected={formik.values.openingHour}
                        onChange={(date) =>
                          formik.setFieldValue("openingHour", date)
                        }
                        showTimeSelect
                        showTimeSelectOnly
                        dateFormat="hh:mm a"
                        className={`form-control ${
                          formik.errors.openingHour && "is-invalid"
                        }`}
                        wrapperClassName="cstm-datepicker"
                      />
                      <Input
                        className="d-none"
                        invalid={
                          formik.errors.openingHour &&
                          formik.touched.openingHour
                        }
                      />
                      <FormFeedback>{formik.errors.openingHour}</FormFeedback>
                    </FormGroup>

                    <FormGroup tag={Col} md={{ size: 6 }}>
                      <Label for="closingHour">Closing Hour</Label>
                      <br></br>
                      <DatePicker
                        selected={formik.values.closingHour}
                        onChange={(date) =>
                          formik.setFieldValue("closingHour", date)
                        }
                        showTimeSelect
                        showTimeSelectOnly
                        dateFormat="hh:mm a"
                        className={`form-control ${
                          formik.errors.closingHour && "is-invalid"
                        }`}
                        wrapperClassName="cstm-datepicker"
                      />
                      <Input
                        className="d-none"
                        invalid={
                          formik.errors.closingHour &&
                          formik.touched.closingHour
                        }
                      />
                      <FormFeedback>{formik.errors.closingHour}</FormFeedback>
                    </FormGroup>
                  </Row>
                </Col>
              </Row>

              <Row>
                <FormGroup tag={Col} md={{ offset: 3, size: 6 }}>
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
                      formik.errors.phoneNumber && formik.touched.phoneNumber
                    }
                  />
                  <FormFeedback>{formik.errors.phoneNumber}</FormFeedback>
                </FormGroup>
              </Row>

              <Row className="d-flex justify-content-center align-items-center">
                <Col
                  md={{
                    size: 1,
                  }}
                >
                  <Button
                    block
                    type="submit"
                    className="mt-2"
                    color="primary"
                    disabled={formik.isSubmitting}
                  >
                    {formik.isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </Col>
              </Row>
            </FormikForm>
          )}
        </Formik>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  // START
  // Ini bagian untuk ngecheck apakah user sudah login atau belum
  const sessionData = await getSession(ctx);

  if (!sessionData) {
    // Jika user belum login maka kita akan redirect dia ke page /auth/login dengan
    // query callbackUrlnya
    return {
      redirect: {
        destination: `/auth/login/?callbackUrl=${ctx.resolvedUrl}`,
        permanent: false,
      },
    };
  }
  console.log(sessionData.user.token);
  // END

  try {
    const responseCategory = await fetcher.get(`/category/getAll`, {
      headers: {
        Authorization: `Bearer ${sessionData.user.token}`,
      },
    });
    const dataCategory = responseCategory.data.data;
    return {
      props: {
        dataCategory,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
