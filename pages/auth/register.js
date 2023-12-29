import TextBox from "@/components/elements/TextBox";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { useRef } from "react";
import { Button } from "reactstrap";

const RegisterPage = () => {
  const userName = useRef("");
  const pass = useRef("");

  const onSubmit = async () => {
    const result = await signIn("credentials", {
      username: userName.current,
      password: pass.current,
      redirect: true,
      callbackUrl: "/",
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
          <h1 className="h3 mb-3 fw-normal text-center">Register</h1>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              onChange={(e) => (userName.current = e.target.value)}
            />
            <label htmlFor="floatingInput">Username</label>
          </div>
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
              className="form-control mb-3"
              id="floatingPassword"
              placeholder="Password"
              onChange={(e) => (pass.current = e.target.value)}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control mb-3"
              id="floatingPassword"
              placeholder="Password"
              onChange={(e) => (pass.current = e.target.value)}
            />
            <label htmlFor="floatingPassword">Confirm password</label>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <Button className="mb-3 bg-primary" onClick={onSubmit}>
              Register
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
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
