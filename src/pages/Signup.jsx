import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import { AuthContext } from "../context";
import { signup } from "../services/user";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser, setToast } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = () => {
    if (!email || !password || !name || !username) {
      setToast({ message: "Please fill all fields", type: "danger" });
      return;
    }

    setLoading(true);
    signup(name, email, password, username)
      .then((user) => {
        setUser(user);
        navigate("/home");
      })
      .catch((err) => setToast({ message: err.response.data, type: "danger" }))
      .finally(() => setLoading(false));
  };

  return (
    <div className="signup py-3">
      <Helmet>
        <title>Signup for Twitter / Twitter</title>
      </Helmet>
      {loading && (
        <Modal
          className="position-absolute"
          style={{
            right: document.body.scrollWidth > 973 ? 0 : "none",
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
        <div className="fw-bold">Create your account</div>
      </div>
      <div className="m-auto mt-4 auth-form">
        <div className="mb-5">
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control rounded-5 border bg-transparent"
              id="name-input"
              onChange={(e) => setName(e.currentTarget.value)}
              value={name}
              autoComplete="off"
            />
            <label htmlFor="name-input">Name</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control rounded-5 border bg-transparent"
              id="account-input"
              onChange={(e) => setUsername(e.currentTarget.value)}
              value={username}
              autoComplete="off"
            />
            <label htmlFor="account-input">Account Name</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control rounded-5 border bg-transparent"
              id="email-input"
              onChange={(e) => setEmail(e.currentTarget.value)}
              value={email}
              autoComplete="off"
            />
            <label htmlFor="email-input">Email</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control rounded-5 border bg-transparent"
              id="password-input"
              onChange={(e) => setPassword(e.currentTarget.value)}
              value={password}
              autoComplete="off"
            />
            <label htmlFor="password-input">Password</label>
          </div>
          <div
            onClick={handleSignup}
            className={`btn hover my-4 py-1 w-100 rounded-pill border${
              name && email && username && password.length < 8
                ? " disabled"
                : ""
            }`}
          >
            Sign up
          </div>
          <div className="text-muted mt-4">
            Already have an account?{" "}
            <Link className="hover-underline" to="/signin">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
