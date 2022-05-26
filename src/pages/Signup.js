import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import { signup, signUpWithGoogle } from "../services/user";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = () => {
    setLoading(true);
    signup(name, email, password, username)
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const handleGoogleSignup = () => {
    setLoading(true);
    signUpWithGoogle();
    setLoading(false);
  };

  return (
    <div className="signup p-3">
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
        <div className="fw-bold">Create your account</div>
      </div>
      <div className="m-auto mt-4" style={{ width: "320px" }}>
        <div className="mb-5">
          <div
            onClick={handleGoogleSignup}
            className="btn hover d-flex px-5 my-2 py-2 justify-content-center align-items-center rounded-pill border"
          >
            <i className="bi bi-google me-2"></i>
            Sign up with Google
          </div>
          <div className="d-flex align-items-center my-2">
            <hr className="w-50" />
            <div className="text-muted mx-2 fs-6">OR</div>
            <hr className="w-50" />
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control rounded-5 border"
              id="name-input"
              style={{ backgroundColor: "transparent" }}
              onChange={(e) => setName(e.currentTarget.value)}
              value={name}
              autoComplete="off"
            />
            <label htmlFor="name-input">Name</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="account"
              className="form-control rounded-5 border"
              id="account-input"
              style={{ backgroundColor: "transparent" }}
              onChange={(e) => setUsername(e.currentTarget.value)}
              value={username}
              autoComplete="off"
            />
            <label htmlFor="account-input">Account Name</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control rounded-5 border"
              id="email-input"
              style={{ backgroundColor: "transparent" }}
              onChange={(e) => setEmail(e.currentTarget.value)}
              value={email}
              autoComplete="off"
            />
            <label htmlFor="email-input">Email</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control rounded-5 border"
              id="password-input"
              style={{ backgroundColor: "transparent" }}
              onChange={(e) => setPassword(e.currentTarget.value)}
              value={password}
              autoComplete="off"
            />
            <label htmlFor="password-input">Password</label>
          </div>
          <div
            onClick={handleSignup}
            className="btn hover d-flex px-5 my-4 py-1 justify-content-center align-items-center rounded-pill border"
          >
            Sign up
          </div>
          <div className="text-muted mt-4">
            Already have an account? <Link to="../signin">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
