import TextBox from "@/components/elements/TextBox";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { Button } from "reactstrap";

const LoginPage = () => {
  const router = useRouter();
  const userName = useRef("");
  const pass = useRef("");

  const onSubmit = async () => {
    const result = await signIn("credentials", {
      username: userName.current,
      password: pass.current,
      redirect: true,
      callbackUrl:
        typeof router.query.callbackUrl === "string"
          ? router.query.callbackUrl
          : "/",
    });
  };
  return (
    <div className="d-flex align-items-center bg-light py-4 full-height-page">
      <div
        className="form-signin w-100 m-auto"
        style={{
          backgroundColor: "#f8da45",
          borderRadius: "3px",
          justifyContent: "center",
        }}
      >
        <form>
          <h1 className="h3 mb-3 fw-normal text-center">Login</h1>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              onChange={(e) => (userName.current = e.target.value)}
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              onChange={(e) => (pass.current = e.target.value)}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <div className="form-check text-start my-3">
            <input
              className="form-check-input"
              type="checkbox"
              defaultValue="remember-me"
              id="flexCheckDefault"
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Remember me
            </label>
          </div>

          <div className="d-flex justify-content-center align-items-center">
            <Button className="mb-3 bg-primary" onClick={onSubmit}>
              Login
            </Button>
          </div>

          <p>
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              style={{
                textDecoration: "none",
              }}
            >
              Register Here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
