import React, { useState } from "react";
import Header from "../components/Header";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  return (
    <div className="notifications">
      <Header title="Notifications" />
      <div className="notifications-container"></div>
      {notifications.length > 0 ? <div className="h-50-vh"></div> : null}
    </div>
  );
}
