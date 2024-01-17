import SwalBootstrap from "@/components/alert/SwalBootstrap";
import AuthLayout from "@/components/layouts/AuthLayout";
import fetcher from "@/utils/fetcher";
import { Formik, Form as FormikForm } from "formik";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button, FormFeedback, Spinner } from "reactstrap";
import * as yup from "yup";

const validationSchema = yup.object().shape({
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
});

const RegisterForm = () => {
  const handleSubmit = async (values, { setFieldError }) => {
    const { username, email, password } = values;
    try {
      const response = await fetcher.post("/auth/register", {
        username,
        email,
        password,
      });

      SwalBootstrap.fire({
        icon: "success",
        title: <p>You have successfully registered your account!</p>,
        text: "You will be logged in 2 seconds",
        showConfirmButton: true,
        showDenyButton: false,
        timer: 2000,
      }).then(() => {
        signIn("credentials", {
          username,
          password,
          redirect: true,
          callbackUrl: "/",
        });
      });
    } catch (error) {
      console.error(error); // On browser console
      SwalBootstrap.fire({
        icon: "error",
        title: <p>Something went wrong!</p>,
        showConfirmButton: true,
        showDenyButton: false,
      });
    }
  };

  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        handleChange,
        isSubmitting,
        errors,
        touched,
        handleBlur,
        values,
      }) => (
        <FormikForm>
          <div className="form-floating mb-3">
            <input
              id="username"
              name="username"
              type="text"
              className={`form-control ${
                touched.username && errors.username ? "is-invalid" : ""
              }`}
              placeholder="Username"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
              autoComplete="off"
            />
            <label htmlFor="username" className="text-secondary">
              Username
            </label>
            <FormFeedback>{errors.username}</FormFeedback>
          </div>

          <div className="form-floating mb-3">
            <input
              id="email"
              name="email"
              type="email"
              className={`form-control ${
                touched.email && errors.email ? "is-invalid" : ""
              }`}
              placeholder="Email Address"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            <label htmlFor="email" className="text-secondary">
              Email Address
            </label>
            <FormFeedback>{errors.email}</FormFeedback>
          </div>

          <div className="form-floating mb-3">
            <input
              id="password"
              name="password"
              type="password"
              className={`form-control ${
                touched.password && errors.password ? "is-invalid" : ""
              }`}
              placeholder="Password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
            <label htmlFor="password" className="text-secondary">
              Password
            </label>
            <FormFeedback>{errors.password}</FormFeedback>
          </div>

          <div className="form-floating">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={`form-control ${
                touched.confirmPassword && errors.confirmPassword
                  ? "is-invalid"
                  : ""
              }`}
              placeholder="Confirm Password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.confirmPassword}
              autoComplete="off"
            />
            <label htmlFor="confirmPassword" className="text-secondary">
              Confirm Password
            </label>
            <FormFeedback>{errors.confirmPassword}</FormFeedback>
          </div>

          <div className="d-grid mt-4">
            <Button type="submit" color="primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </div>
        </FormikForm>
      )}
    </Formik>
  );
};

const RegisterPage = () => {
  return (
    <div
      className="card border-0"
      style={{
        maxWidth: "370px",
        margin: "auto",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
      }}
    >
      <div className="card-body">
        <h1 className="fs-2 fw-bolder mb-3 text-center">Register</h1>
        <RegisterForm />
      </div>
      <div className="card-footer p-3">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-decoration-none">
          Login
        </Link>
      </div>
    </div>
  );
};

RegisterPage.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default RegisterPage;
