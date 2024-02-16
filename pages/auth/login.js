import SwalBootstrap from "@/components/alert/SwalBootstrap";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Formik, Form as FormikForm } from "formik";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Spinner } from "reactstrap";

const LoginForm = () => {
  const router = useRouter();
  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
      }}
      onSubmit={async (values, { setFieldError }) => {
        const callbackUrl =
          typeof router.query.callbackUrl === "string"
            ? router.query.callbackUrl
            : "/";

        const authResponse = await signIn("credentials", {
          username: values.username,
          password: values.password,
          redirect: false,
        });

        if (!authResponse.ok) {
          setFieldError("username", "Credentials are invalid");
          return SwalBootstrap.fire({
            icon: "error",
            title: "Error",
            text: "Credentials are invalid",
          });
        }

        SwalBootstrap.fire({
          icon: "success",
          title: "Success",
          text: "Logged in successfully. Redirecting in 2 seconds...",
          timer: 2000,
        }).then(() => {
          router.push(callbackUrl);
        });
      }}
    >
      {({ handleChange, isSubmitting, errors, touched }) => (
        <FormikForm>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              autoComplete="none"
              id="username"
              placeholder="Username"
              onChange={handleChange}
            />
            <label htmlFor="username" className="text-secondary">
              Username
            </label>
          </div>

          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              onChange={handleChange}
            />
            <label htmlFor="password" className="text-secondary">
              Password
            </label>
          </div>

          {touched.username && errors.username && (
            <div className="text-danger text-center my-3">
              {errors.username}
            </div>
          )}

          <div className="d-grid mt-4">
            <Button
              type="submit"
              style={{ backgroundColor: "#00b4d8" }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </FormikForm>
      )}
    </Formik>
  );
};

const LoginPage = () => {
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
        <h1 className="fs-2 fw-bolder mb-3 text-center">Have an account?</h1>
        <LoginForm />
      </div>
      <div className="card-footer p-3">
        Don't have an account?{" "}
        <Link
          href="/auth/register"
          className="text-decoration-none fw-semibold"
          style={{ color: "#00b4d8" }}
        >
          Register Now
        </Link>
      </div>
    </div>
  );
};

LoginPage.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default LoginPage;

export async function getServerSideProps(ctx) {
  // START
  // Ini bagian untuk ngecheck apakah user sudah login atau belum
  const sessionData = await getSession(ctx);

  if (sessionData) {
    // Jika user belum login maka kita akan redirect dia ke page /auth/login dengan
    // query callbackUrlnya
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
}
