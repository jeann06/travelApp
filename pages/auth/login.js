import TextBox from "@/components/elements/TextBox";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { Button } from "reactstrap";

const backgroundImage = 'https://wallpapers.com/images/hd/jakarta-city-roundabout-957wm6er9fu1zp8p.jpg';

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

  const pageStyle = {
    background: `url(${backgroundImage}) no-repeat center center fixed`,
    backgroundSize: 'cover',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const containerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    border: '1px solid #ddd', 
    borderRadius: '20px',
    padding: '20px',
    width: '400px', 
  };

  return (
    <div className="d-flex align-items-center py-4 full-height-page" style={pageStyle}>
      <div
        className="form-signin"
        style={containerStyle}
      >
        <form>
          <h1 className="h3 mb-3 fw-normal text-center">Have an account?</h1>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              onChange={(e) => (userName.current = e.target.value)}
            />
            <label htmlFor="floatingInput" className="text-secondary">Email address</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              onChange={(e) => (pass.current = e.target.value)}
            />
            <label htmlFor="floatingPassword" className="text-secondary"x>Password</label>
          </div>
          <div className="form-check text-start mb-3">
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

          <div className="d-grid gap-2">
            <Button className="bg-primary" onClick={onSubmit}>
              Login
            </Button>
          </div>
          <p className="mt-3">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              style={{
                textDecoration: "none",
              }}
            >
              Register Now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
