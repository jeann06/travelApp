import TextBox from "@/components/elements/TextBox";
import fetcher from "@/utils/fetcher";
import { Formik, Form as FormikForm } from "formik";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { useRef } from "react";
import { Button, FormFeedback } from "reactstrap";
import * as yup from "yup";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const RegisterPage = () => {
  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={yup.object().shape({
        username: yup.string().required("Username is required"),
        email: yup.string().email().required("Email is required"),
        password: yup.string().min(8).max(16).required("Password is required"),
        confirmPassword: yup
          .string()
          .oneOf(
            [yup.ref("password"), null],
            "Confirm password does not match with password"
          )
          .required("Confirm password is required"),
      })}
      onSubmit={async (values, actions) => {
        const { confirmPassword, ...rest } = values;

        try {
          const response = await fetcher.post("/auth/register", rest);

          MySwal.fire({
            icon: "success",
            title: <p>You has successfully registered your account!</p>,
            text: "You will be logged in 2 seconds",
            showConfirmButton: true,
            showDenyButton: false,
            timer: 2000,
          }).then(() => {
            signIn("credentials", {
              username: values.username,
              password: values.password,
              redirect: true,
              callbackUrl: "/",
            });
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
          <div className="d-flex align-items-center bg-light py-4 full-height-page">
            <div
              className="form-signin w-100 m-auto"
              style={{
                backgroundColor: "#f8da45",
                borderRadius: "3px",
                justifyContent: "center",
              }}
            >
              <h1 className="h3 mb-3 fw-normal text-center">Register</h1>
              <div className="form-floating mb-3">
                <input
                  id="username"
                  name="username"
                  type="text"
                  className={`form-control ${
                    formik.errors.username ? "is-invalid" : ""
                  }`}
                  placeholder="name@example.com"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  autoComplete="off"
                />
                <label htmlFor="username">Username</label>
                <FormFeedback>{formik.errors.username}</FormFeedback>
              </div>

              <div className="form-floating mb-3">
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-control ${
                    formik.errors.email ? "is-invalid" : ""
                  }`}
                  placeholder="name@example.com"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  autoComplete="off"
                />
                <label htmlFor="email">Email Address</label>
                <FormFeedback>{formik.errors.email}</FormFeedback>
              </div>

              <div className="form-floating mb-3">
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={`form-control ${
                    formik.errors.password ? "is-invalid" : ""
                  }`}
                  placeholder="name@example.com"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  autoComplete="off"
                />
                <label htmlFor="password">Password</label>
                <FormFeedback>{formik.errors.password}</FormFeedback>
              </div>

              <div className="form-floating mb-3">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className={`form-control ${
                    formik.errors.confirmPassword ? "is-invalid" : ""
                  }`}
                  placeholder="name@example.com"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  autoComplete="off"
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
                <FormFeedback>{formik.errors.confirmPassword}</FormFeedback>
              </div>

              <div className="d-flex justify-content-center align-items-center">
                <Button
                  type="submit"
                  color="primary"
                  disabled={formik.isSubmitting}
                  className="mb-3"
                >
                  {formik.isSubmitting ? "Registering..." : "Register"}
                </Button>
              </div>

              <p>
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  Login Here
                </Link>
              </p>
            </div>
          </div>
        </FormikForm>
      )}
    </Formik>
  );
};

export default RegisterPage;
