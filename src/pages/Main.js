import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { AuthContext } from "../config/context";
import { signinAnonymously } from "../services/user";

export default function Main() {
  const { setLoading } = useContext(AuthContext);
  return (
    <div className="main-page py-3 text-primary">
      <Helmet>
        <title>Twitter. what's happening / Twitter</title>
      </Helmet>
      <div
        className="p-3 pt-0 d-flex justify-content-center flex-wrap"
        style={{ fontSize: "50px" }}
      >
        <div className="me-4">
          <i className="bi bi-twitter"></i>
        </div>
        <div className="fw-bold">Happening now</div>
      </div>
      <div className="m-auto" style={{ width: "300px" }}>
        <div className="fs-1 text-center mb-4">Join Twitter today.</div>
        <Link to="signup">
          <div className="btn hover d-flex px-5 my-1 py-2 justify-content-center align-items-center rounded-pill border">
            Create new account
          </div>
        </Link>
        <div className="d-flex align-items-center my-3">
          <hr className="w-50" />
          <span className="mx-2 text-muted fs-6">OR</span>
          <hr className="w-50" />
        </div>
        <div
          onClick={() => {
            setLoading(true);
            signinAnonymously().then(() => setLoading(false));
          }}
          className="btn hover d-flex px-5 my-2 py-2 justify-content-center align-items-center rounded-pill border"
        >
          Anonymously surf Twitter
        </div>
        <div className="text-muted mt-5">
          Already have an account?
          <Link to="signin"> Sign in</Link>
        </div>
      </div>
    </div>
  );
}
