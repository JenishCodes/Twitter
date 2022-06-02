import React, { useState } from "react";
import Header from "../components/Header";

export default function Notifications() {
  const [notifications] = useState([]);
  const [loading] = useState(true);
  return (
    <div className="notifications">
      <Header title="Notifications" />
      <div className="notifications-container"></div>
      {notifications.length > 0 ? (
        <div className="h-50-vh"></div>
      ) : (
        !loading && (
          <div className="text-center text-muted mt-5">No Notifications</div>
        )
      )}
      {loading ? (
        <div className="text-center my-5">
          <div
            className="spinner-border text-app"
            style={{ width: "1.5rem", height: "1.5rem" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
