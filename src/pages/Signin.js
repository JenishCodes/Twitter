import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import { signin, signUpWithGoogle } from "../services/user";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignin = () => {
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }
    setLoading(true);
    signin(email, password)
      .catch((err) => setError(err.code))
      .finally(() => setLoading(false));
  };

  const handleGoogleSignin = () => {
    setLoading(true);
    signUpWithGoogle("");
    setLoading(false);
  };

  useEffect(() => {
    if (error) setTimeout(() => setError(""), 5000);
  }, [error]);

  return (
    <div className="signin py-3">
      <Helmet>
        <title>Signin to Twitter / Twitter</title>
      </Helmet>
      {loading ? (
        <Modal
          style={{
            right: document.body.scrollWidth > 973 ? 0 : "none",
            position: "absolute",
            width:
              document.body.scrollWidth > 973
                ? (document.body.scrollWidth * 5) / 12
                : "100%",
          }}
        >
          <Loading
            show={true}
            className="my-5 text-app"
            style={{ width: "1.5rem", height: "1.5rem" }}
          />
        </Modal>
      ) : null}
      {error ? (
        <div
          className="text-white bg-danger rounded-3 p-2 position-absolute"
          style={{ width: "300px", left: "50%", transform: "translateX(-50%)" }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <i className="bi bi-exclamation-circle fs-2"></i>
              <div className="ms-2">{error}</div>
            </div>
            <div
              onClick={() => setError("")}
              className="btn-close pointer btn-close-white me-2 m-auto"
            ></div>
          </div>
        </div>
      ) : null}
      <div
        className="p-3 pt-0 d-flex justify-content-center"
        style={{ fontSize: "30px" }}
      >
        <Link to="/">
          <div className="me-4">
            <i className="bi bi-twitter"></i>
          </div>
        </Link>
        <div className="fw-bold">Sign in to Twitter</div>
      </div>
      <div className="m-auto mt-4" style={{ width: "300px" }}>
        <div className="mb-5">
          <div
            onClick={handleGoogleSignin}
            className="btn hover d-flex px-5 my-2 py-2 justify-content-center align-items-center rounded-pill border"
          >
            <i className="bi bi-google me-2"></i>
            Sign in with Google
          </div>
          <div className="d-flex align-items-center my-3">
            <hr className="w-50" />
            <div className="text-muted mx-2 fs-6">OR</div>
            <hr className="w-50" />
          </div>
          <div className="form-floating mt-2 mb-3">
            <input
              type="email"
              className="form-control rounded-5 border"
              id="email-input"
              style={{ backgroundColor: "transparent" }}
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              autoComplete="off"
            />
            <label htmlFor="email-input">Email</label>
          </div>
          <div className="form-floating mb-1">
            <input
              type="password"
              className="form-control rounded-5 border"
              id="password-input"
              style={{ backgroundColor: "transparent" }}
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              autoComplete="off"
            />
            <label htmlFor="password-input">Password</label>
          </div>
          <div className="text-end">
            <Link className="hover-underline" to="/forgot">
              Forgot password?
            </Link>
          </div>
          <div
            onClick={handleSignin}
            className="btn hover d-flex px-5 my-4 py-1 justify-content-center align-items-center rounded-pill border"
          >
            Sign in
          </div>
          <div className="text-muted mt-4">
            Don't have an account?{" "}
            <Link className="hover-underline" to="/signup">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
