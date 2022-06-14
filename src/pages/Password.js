import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import Loading from "../components/Loading";
import { resetPassword } from "../services/user";

export default function Password() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!password || !confirmPassword) {
      setToast("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setToast("Passwords do not match");
      return;
    }

    setLoading(true);
    resetPassword(password)
      .then(() => navigate("/settings/account", { replace: true }))
      .catch((err) => setToast(err.code))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (toast) setTimeout(() => setToast(""), 5000);
  }, [toast]);

  return (
    <div>
      <Helmet>
        <title>Update password / Twitter</title>
      </Helmet>
      <Header title="Update password" backArrow="full" />

      {toast ? (
        <div
          className="text-white bg-danger rounded-3 p-2 position-absolute"
          style={{
            width: "300px",
            left: "50%",
            bottom: "5%",
            transform: "translateX(-50%)",
          }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <i className="bi bi-exclamation-circle fs-2"></i>
              <div className="ms-2">{toast}</div>
            </div>
            <div
              onClick={() => setToast(null)}
              className="btn-close pointer btn-close-white me-2 m-auto"
            ></div>
          </div>
        </div>
      ) : null}
      <div className="px-3">
        <div className="form-floating my-3">
          <input
            type="password"
            className="form-control rounded-5"
            style={{ backgroundColor: "transparent" }}
            value={password}
            disabled={loading}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <label htmlFor="phone-input">New Password</label>
        </div>
        <div className="form-floating my-3">
          <input
            type="password"
            className="form-control rounded-5"
            style={{ backgroundColor: "transparent" }}
            value={confirmPassword}
            disabled={loading}
            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
          />
          <label htmlFor="phone-input">Confirm Password</label>
        </div>
      </div>
      <hr className="my-2" />
      <div
        className={`rounded-0 py-2 btn w-100 hover d-flex justify-content-center ${
          loading ? "disabled" : ""
        }`}
        onClick={handleSubmit}
      >
        <Loading
          show={loading}
          className="me-3"
          style={{ width: "20px", height: "20px" }}
        />
        Update password
      </div>
    </div>
  );
}
