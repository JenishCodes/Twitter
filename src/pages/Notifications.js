import React, { useState } from "react";
import Header from "../components/Header";
import Loading from "../components/Loading";

export default function Notifications() {
  const [notifications] = useState([]);
  const [loading] = useState(false);

  return (
    <div className="notifications">
      <Header title="Notifications" />

      <Loading
        show={loading}
        className="my-5 text-app"
        style={{ width: "1.5rem", height: "1.5rem" }}
      />

      {notifications.length > 0
        ? notifications.map((notification, index) => (
            <div key={index}>{notification}</div>
          ))
        : !loading && (
            <div className="text-center text-muted mt-5">No Notifications</div>
          )}

      {notifications.length > 0 ? <div className="h-50-vh"></div> : null}
    </div>
  );
}
