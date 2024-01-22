import { DebugFormik } from "@/components/DebugFormik";
import fetcher from "@/utils/fetcher";
import { Formik, Form as FormikForm } from "formik";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import * as yup from "yup";
import {
  Button,
  Col,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { useState, useEffect } from "react";

export default function EditProfilePage(props) {
  const { data } = props;
  const [previewImage, setPreviewImage] = useState(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    let isFetching = false;

    async function fetchImagesFromServer() {
      const destinationPath = `/${data.profileUrl}`;
      const blobResponse = await fetcher.get(destinationPath, {
        responseType: "blob",
      });
      const blob = blobResponse.data;

      const file = new File([blob], data.username, { type: blob.type });

      if (!isFetching) {
        setPreviewImage(file);
      }
    }

    if (previewImage) {
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
            <h4 className="text-center mb-4">Suggest New Place</h4>
            <Formik
              enableReinitialize
              initialValues={{
                file: previewImage || null,
                username: data.username,
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                dob: data.dob || new Date(),
              }}
              validationSchema={yup.object().shape({
                file: yup.mixed().optional(),
                fullName: yup.string().optional(),
                email: yup.string().optional(),
                phone: yup.string().optional(),
                dob: yup.string().optional(),
              })}
              onSubmit={async (values, actions) => {
                const { file, ...rest } = values;

                const formData = new FormData();
                formData.append("file", file);
                formData.append("data");

                try {
                  const response = await fetcher.post("/user/edit", formData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                      Authorization: `Bearer ${session.user.token}`,
                    },
                  });

                  if (response.data.responseSchema.status === "Error") {
                    return MySwal.fire({
                      icon: "error",
                      title: <p>{response.data.responseSchema.message}</p>,
                      showConfirmButton: true,
                      showDenyButton: false,
                    });
                  }

                  const id = response.data.data.id;

                  successAlertNotification(
                    "Success",
                    "Place has successfully added!"
                  ).then(() => {
                    router.reload(`/user/edit`);
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
                  <DebugFormik />
                  <div className="px-4">
                    <Row>
                      <Col md={{ size: 12 }}>
                        <FormGroup>
                          {formik.values.file && (
                            <div
                              className="position-relative"
                              style={{
                                width: 100,
                                height: 100,
                              }}
                            >
                              <img
                                src={URL.createObjectURL(formik.values.file)}
                                className="d-block object-fit-cover border rounded w-100 h-100"
                                alt=""
                              />
                            </div>
                          )}

                          <label
                            className="d-block btn btn-primary mt-2"
                            htmlFor="changeImage"
                          >
                            Change image
                          </label>
                          <input
                            id="changeImage"
                            type="file"
                            accept="image/*"
                            hidden
                            onBlur={formik.handleBlur}
                            onChange={(e) => {
                              if (
                                !e.target.files &&
                                e.target.files.length === 0
                              ) {
                                return;
                              }

                              const file = e.target.files[0];
                              formik.setFieldValue("file", file);
                            }}
                          />

                          {formik.touched.file && formik.errors.file && (
                            <div className="text-danger">
                              {formik.errors.file}
                            </div>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <FormGroup tag={Col} md={{ size: 12 }}>
                        <Label for="username">Username</Label>
                        <Input
                          id="username"
                          name="username"
                          placeholder="username"
                          type="text"
                          value={formik.values.username}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          invalid={
                            formik.errors.username && formik.touched.username
                          }
                          disabled
                        />
                        <FormFeedback>{formik.errors.username}</FormFeedback>
                      </FormGroup>
                    </Row>

                    <Row>
                      <FormGroup tag={Col} md={{ size: 12 }}>
                        <Label for="title">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          placeholder="Full Name"
                          type="text"
                          value={formik.values.fullName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          invalid={
                            formik.errors.fullName && formik.touched.fullName
                          }
                        />
                        <FormFeedback>{formik.errors.fullName}</FormFeedback>
                      </FormGroup>
                    </Row>

                    <Row>
                      <FormGroup tag={Col} md={{ size: 12 }} className="">
                        <Label for="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="Phone Number"
                          type="text"
                          style={{ resize: "none" }}
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          invalid={formik.errors.phone && formik.touched.phone}
                        />
                        <FormFeedback>{formik.errors.phone}</FormFeedback>
                      </FormGroup>
                    </Row>

                    <Row>
                      <FormGroup tag={Col} md={{ size: 12 }} className="">
                        <Label for="dob">Date of Birth</Label>
                        <Input
                          id="dob"
                          name="dob"
                          placeholder="Phone Number"
                          type="date"
                          style={{ resize: "none" }}
                          value={formik.values.dob}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          invalid={formik.errors.dob && formik.touched.dob}
                        />
                        <FormFeedback>{formik.errors.dob}</FormFeedback>
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
    const response = await fetcher.get(`/user/get`, {
      headers: {
        Authorization: `Bearer ${sessionData.user.token}`,
      },
    });
    const data = response.data.data;
    return {
      props: {
        data,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
