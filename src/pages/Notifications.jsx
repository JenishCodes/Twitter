import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import List from "../components/List";
import Loading from "../components/Loading";
import { AuthContext } from "../context";
import {
  getNotifications,
  markNotificationAsRead,
} from "../services/notification";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [hasMoreNotifications, setHasMoreNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { scrollY } = useContext(AuthContext);

  useEffect(() => {
    if (
      hasMoreNotifications &&
      (scrollY + window.innerHeight >= document.body.offsetHeight ||
        notifications.length === 0)
    ) {
      getNotifications(notifications.length)
        .then((res) => {
          setHasMoreNotifications(res.hasMore);
          setNotifications(res.data);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  }, [scrollY]);

  return (
    <div className="notifications">
      <Helmet>
        <title>Notifications / Twitter</title>
      </Helmet>
      <Header title="Notifications" />

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

      <Loading show={loading} className="my-5 text-app" />

      {notifications.length > 0 ? <div className="h-50-vh"></div> : null}
    </div>
  );
}
