import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Settings() {
  const naviagte = useNavigate();

  return (
    <div>
      <Header title="Settings" backArrow="half" />
      <div className="pointer" onClick={() => naviagte("/settings/account")}>
        <div className="p-3 hover">
          <div className="d-flex justify-content-between">
            <div>Your Account</div>
            <div>
              <i className="bi bi-chevron-right text-muted"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer" onClick={() => naviagte("/settings/notifications")}>
        <div className="p-3 hover">
          <div className="d-flex justify-content-between">
            <div>Notifications</div>
            <div>
              <i className="bi bi-chevron-right text-muted"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer" onClick={() => naviagte("/settings/privacy")}>
        <div className="p-3 hover">
          <div className="d-flex justify-content-between">
            <div>Privacy and safety</div>
            <div>
              <i className="bi bi-chevron-right text-muted"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer" onClick={() => naviagte("/settings/display")}>
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
