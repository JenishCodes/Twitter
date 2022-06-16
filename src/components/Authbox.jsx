import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/user";

export function Authbox() {
  const navigate = useNavigate();
  return (
    <div className="py-3 px-4">
      <div className="border py-2 px-3" style={{ borderRadius: "15px" }}>
        <div className="fs-3 fw-bold">New to Twitter?</div>
        <div className="fs-6 text-muted mt-2">
          Sign up now to share your tweets and see what's happening
        </div>
        <div>
          <div
            className="btn fw-bold mt-3 mb-2 w-100 text-secondary filter bg-secondary rounded-pill p-2"
            onClick={() => logout(true).then(() => navigate("/signup"))}
          >
            Sign up
          </div>
          <div
            className="btn fw-bold mb-3 mt-2 w-100 hover border rounded-pill p-2"
            onClick={() => logout(true).then(() => navigate("/signin"))}
          >
            Log in
          </div>
        </div>
      </div>
    </div>
  );
}
