import React from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { auth } from "../config/firebase";

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div>
      <Helmet>
        <title>Settings / Twitter</title>
      </Helmet>
      <Header title="Settings" backArrow="half" />
      <div
        className="pointer"
        onClick={() => {
          const now = new Date();
          const lastLogin = new Date(auth.currentUser.metadata.lastSignInTime);

          if (now - lastLogin < 600000) {
            navigate("account");
          } else {
            navigate("re-authenticate");
          }
        }}
      >
        <div className="p-3 hover">
          <div className="d-flex justify-content-between">
            <div>Your Account</div>
            <div>
              <i className="bi bi-chevron-right text-muted"></i>
            </div>
          </div>
        </div>
      </div>
      <div
        className="pointer"
        onClick={() => navigate("/settings/notifications")}
      >
        <div className="p-3 hover">
          <div className="d-flex justify-content-between">
            <div>Notifications</div>
            <div>
              <i className="bi bi-chevron-right text-muted"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer" onClick={() => navigate("/settings/privacy")}>
        <div className="p-3 hover">
          <div className="d-flex justify-content-between">
            <div>Privacy and safety</div>
            <div>
              <i className="bi bi-chevron-right text-muted"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer" onClick={() => navigate("/settings/display")}>
        <div className="p-3 hover">
          <div className="d-flex justify-content-between">
            <div>Display and accessibility</div>
            <div>
              <i className="bi bi-chevron-right text-muted"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
