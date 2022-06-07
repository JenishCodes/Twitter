import React, { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import Modal from "../components/Modal";

export default function Forgot() {
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);
  const handleSubmit = () => {};

  return (
    <div className="signup py-3">
      {loading ? (
        <Modal
          style={{
            right: 0,
            position: "absolute",
            width:
              window.screen.width > 991
                ? (window.screen.width * 5) / 12
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
      <div
        className="p-3 pt-0 d-flex justify-content-center"
        style={{ fontSize: "30px" }}
      >
        <Link to="/">
          <div className="me-4">
            <i className="bi bi-twitter"></i>
          </div>
        </Link>
        <div className="fw-bold">Reset Password</div>
      </div>
      <div className="m-auto mt-4" style={{ width: "300px" }}>
        <div className="mb-5">
          <div className="form-floating mb-1">
            <input
              type="email"
              className="form-control rounded-5 border"
              id="email-input"
              style={{ backgroundColor: "transparent" }}
              onChange={(e) => setEmail(e.currentTarget.value)}
              value={email}
            />
            <label htmlFor="email-input">Email</label>
          </div>
          <div className="text-end">
            <Link className="hover-underline" to="/signin">
              Remembered password?
            </Link>
          </div>
          <div
            onClick={handleSubmit}
            className="btn hover d-flex px-5 my-4 py-1 justify-content-center align-items-center rounded-pill border"
          >
            Get Password Reset Link
          </div>
        </div>
      </div>
    </div>
  );
}
