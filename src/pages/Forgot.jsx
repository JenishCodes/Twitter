import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import { AuthContext } from "../context";

export default function Forgot() {
  const [credential, setCredential] = useState("");
  const [loading, setLoading] = useState(false);
  const { setToast } = useContext(AuthContext);

  const handleSubmit = () => {
    setLoading(true);
    setToast({ message: "This service is not yet implemented.", type: "info" });
    setLoading(false);
  };

  return (
    <div className="forgot py-3">
      <Helmet>
        <title>Reset Password / Twitter</title>
      </Helmet>
      {loading && (
        <Modal
          className="end-0 position-absolute"
          style={{
            width:
              window.screen.width > 991
                ? (window.screen.width * 5) / 12
                : "100%",
          }}
        >
          <Loading show className="my-5 text-app" />
        </Modal>
      )}
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
      <div className="m-auto mt-4 auth-form">
        <div className="mb-5">
          <div className="form-floating mb-1">
            <input
              type="text"
              className="form-control rounded-5 border bg-transparent"
              id="credential-input"
              onChange={(e) => setCredential(e.currentTarget.value)}
              value={credential}
            />
            <label htmlFor="credential-input">Account Name / Email</label>
          </div>
          <div className="text-end">
            <Link className="hover-underline" to="/signin">
              Remembered password?
            </Link>
          </div>
          <div
            onClick={handleSubmit}
            className={`btn hover my-4 py-1 w-100 rounded-pill border${
              !credential ? " disabled" : ""
            }`}
          >
            Get Password Reset Link
          </div>
        </div>
      </div>
    </div>
  );
}
