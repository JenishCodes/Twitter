import React from "react";
import { Link } from "react-router-dom";

export default function Main() {
  return (
    <div className="main-page p-3 text-primary">
      <div
        className="p-3 pt-0 d-flex justify-content-center"
        style={{ fontSize: "50px" }}
      >
        <div className="me-4">
          <i className="bi bi-twitter"></i>
        </div>
        <div className="fw-bold">Happening now</div>
      </div>
      <div className="m-auto" style={{ width: "340px" }}>
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
        <div className="btn hover d-flex px-5 my-2 py-2 justify-content-center align-items-center rounded-pill border">
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
