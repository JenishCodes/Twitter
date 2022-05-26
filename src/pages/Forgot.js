import React, { useState } from "react";

export default function Forgot() {
  const [email, setEmail] = useState();
  const handleSubmit = () => {};
  return (
    <div className="signup p-3">
      <div
        className="p-3 pt-0 d-flex align-items-center"
        style={{ fontSize: "30px" }}
      >
        <div className="me-4">
          <i className="bi bi-twitter"></i>
        </div>
        <div className="fw-bold">Reset Password</div>
      </div>
      <div className="m-auto mt-5" style={{ width: "320px" }}>
        <div className="mb-5">
          <div className="form-floating mb-3">
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
