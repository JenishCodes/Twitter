import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import { signin, signUpWithGoogle } from "../services/user";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignin = () => {
    setLoading(true);
    signin(email, password)
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const handleGoogleSignin = () => {
    setLoading(true);
    signUpWithGoogle("")
    setLoading(false);
  };

  return (
    <div className="signin p-3">
      {loading ? (
        <Modal bg_color="rgba(0, 0, 0, 0.4)">
          <div className="text-center my-5">
            <div
              className="spinner-border text-app"
              style={{ width: "1.5rem", height: "1.5rem" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Modal>
      ) : null}
      <div
        className="p-3 pt-0 d-flex align-items-center"
        style={{ fontSize: "30px" }}
      >
        <div className="me-4">
          <i className="bi bi-twitter"></i>
        </div>
        <div className="fw-bold">Sign in to Twitter</div>
      </div>
      <div className="m-auto mt-5" style={{ width: "320px" }}>
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
            <Link to="/forgot">Forgot password?</Link>
          </div>
          <div
            onClick={handleSignin}
            className="btn hover d-flex px-5 my-4 py-1 justify-content-center align-items-center rounded-pill border"
          >
            Sign in
          </div>
          <div className="text-muted mt-4">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
