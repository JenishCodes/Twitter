import React, { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import List from "../components/List";
import Loading from "../components/Loading";
import { AuthContext } from "../config/context";
import {
  getNotifications,
  markNotificationAsRead,
} from "../services/notification";

export default function Notifications() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getNotifications(user._id, 0, 10)
      .then((res) => setNotifications(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="notifications">
      <Helmet><title>Notifications / Twitter</title></Helmet>
      <Header title="Notifications" />

      <Loading
        show={loading}
        className="my-5 text-app"
        style={{ width: "1.5rem", height: "1.5rem" }}
      />

      {notifications.length > 0
        ? notifications.map((notification, index) => (
            <List
              key={index}
              data={{
                title: <div className="fw-normal">{notification.message}</div>,
                image: (
                  <div className="text-primary px-2">
                    <i
                      className={`bi bi-${
                        notification.message.includes("mentioned")
                          ? "at"
                          : notification.message.includes("followed")
                          ? "person-plus-fill"
                          : "reply-all-fill"
                      } fs-1`}
                    ></i>
                  </div>
                ),
              }}
              className={`hover pointer${notification.read ? "" : " bg-muted"}`}
              onClick={() => {
                markNotificationAsRead(notification._id);
                navigate(notification.action);
              }}
            />
          ))
        : !loading && (
            <div className="text-center text-muted mt-5">No Notifications</div>
          )}

      {notifications.length > 0 ? <div className="h-50-vh"></div> : null}
    </div>
  );
}
