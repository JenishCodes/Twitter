import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import { AuthContext } from "../context";
import { signin } from "../services/user";

export default function Signin() {
  const [credential, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser, setToast } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignin = () => {
    setLoading(true);
    signin(credential, password)
      .then((user) => {
        setUser(user);
        navigate("/home");
      })
      .catch((err) => setToast({ message: err.response.data, type: "danger" }))
      .finally(() => setLoading(false));
  };

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
          <div className="form-floating mt-2 mb-3">
            <input
              type="text"
              className="form-control rounded-5 border"
              style={{ backgroundColor: "transparent" }}
              id="credential-input"
              value={credential}
              onChange={(e) => setEmail(e.currentTarget.value)}
              autoComplete="off"
            />
            <label htmlFor="credential-input">Account Name / Email</label>
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
            className={`btn hover my-4 py-1 w-100 rounded-pill border${
              credential && password.length < 8 ? " disabled": ""
            }`}
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
