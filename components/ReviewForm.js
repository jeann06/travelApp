import React from "react";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import {
  Modal,
  Button,
  Col,
  Row,
  FormGroup,
  FormFeedback,
  Input,
} from "reactstrap";
import Rating from "react-rating";
import { Star } from "react-feather";

function ReviewForm({ isOpen, toggleModal, onSubmit }) {
  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <div className="modal-header">
        <h2 className="mt-4">Review</h2>
        <button type="button" className="btn-close" onClick={toggleModal} />
      </div>
      <div className="modal-body">
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
                    onChange={(value) => formik.setFieldValue("rating", value)}
                    emptySymbol={
                      <Star color="#ffe234" className="text-muted" />
                    }
                    fullSymbol={
                      <Star
                        color="#ffe234"
                        fill="#ffe234"
                        className="text-warning"
                      />
                    }
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
      </div>
    </Modal>
  );
}
