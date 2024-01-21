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
import { useState } from "react";

export default function EditProfilePage(props) {
  const { data } = props;
  const [previewImages, setPreviewImages] = useState([]);
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <div style={{ backgroundColor: "#f0f0f0", flex: 1 }}>
      <div className="container py-5">
        <div className="card mx-auto" style={{ maxWidth: "800px" }}>
          <div className="card-body py-4">
            <h4 className="text-center mb-4">Suggest New Place</h4>
            <Formik
              initialValues={{
                files: [],
                username: data.username,
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                dob: data.dob || new Date(),
              }}
              validationSchema={yup.object().shape({
                files: yup.array().required("Images is required"),
                fullName: yup.string().required("Place Name is required"),
                email: yup.string().required("Email is required"),
                phone: yup.string().required("Phone Number is required"),
                dob: yup.string().required("DOB is required"),
              })}
              onSubmit={async (values, actions) => {
                const { files, ...rest } = values;

                const formData = new FormData();
                files.forEach((file, index) => {
                  formData.append("files", file);
                });

                formData.append("data");

                try {
                  const response = await fetcher.post(
                    "/post/create",
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
                    "Place has successfully added!"
                  ).then(() => {
                    router.push(`/user/edit`);
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
                  {/* <DebugFormik /> */}
                  <div className="px-4">
                    <Row>
                      <Col md={{ size: 12 }}>
                        <FormGroup>
                          <label className="d-block">
                            <input
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
                                formik.setFieldValue(
                                  "files",
                                  Array.from(files)
                                );
                                setPreviewImages(
                                  Array.from(files).map((file) =>
                                    URL.createObjectURL(file)
                                  )
                                );
                              }}
                            />

                            {previewImages.length > 0 ? (
                              <>
                                <LightboxImage images={previewImages} />
                                <div className="d-grid">
                                  <div className="btn btn-primary mt-2">
                                    Change Image
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="d-grid">
                                <div className="btn btn-primary">
                                  Select Image
                                </div>
                              </div>
                            )}
                          </label>
                          <Input
                            className="d-none"
                            invalid={formik.errors.files}
                          />
                          <FormFeedback>{formik.errors.files}</FormFeedback>
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
