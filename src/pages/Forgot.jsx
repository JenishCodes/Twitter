import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import Modal from "../components/Modal";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = () => {
    if (!email) {
      setToast("Please fill all fields");
      return;
    }
    setLoading(true);
  };

  useEffect(() => {
    if (toast) setTimeout(() => setToast(null), 5000);
  }, [toast]);

  return (
    <div className="signup py-3">
      <Helmet>
        <title>Reset Password / Twitter</title>
      </Helmet>
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
      {toast ? (
        <div
          className={`text-white bg-${
            toast.error ? "danger" : "success"
          } rounded-3 p-2 position-absolute`}
          style={{ width: "300px", left: "50%", transform: "translateX(-50%)" }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <i className="bi bi-exclamation-circle fs-2"></i>
              <div className="ms-2">{toast.message}</div>
            </div>
            <div
              onClick={() => setToast("")}
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
