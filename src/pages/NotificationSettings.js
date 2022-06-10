import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import List from "../components/List";
import { AuthContext } from "../config/context";
import { updateUserSettings } from "../services/user";

export default function NotificationSettings() {
  const { user, setUser } = useContext(AuthContext);

  const handleClick = (e, type) => {
    e.preventDefault();
    updateUserSettings(user._id, { [type]: !user.settings[type] })
      .then(() => {
        const settings = { ...user.settings, [type]: !user.settings[type] };
        setUser({ ...user, settings });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Helmet>
        <title>Notifications / Twitter</title>
      </Helmet>

      <Header title="Notifications" backArrow="full" />
      <List
        data={{
          title: "New Followers",
          subtitle: "Get notification when someone follows you",
          image: (
            <div className="text-primary py-2">
              <i className="bi bi-person-plus-fill fs-2 mx-2"></i>
            </div>
          ),
        }}
        className="hover pointer"
        onClick={(e) => handleClick(e, "followNotification")}
        actionButton={
          <input
            type="checkbox"
            checked={user.settings.followNotification}
            onChange={() => {}}
          />
        }
      />
      <List
        data={{
          title: "Mentions",
          subtitle: "Get notification when someone mention you in their tweet",
          image: (
            <div className="text-primary py-2">
              <i className="bi bi-at fs-2 mx-2"></i>
            </div>
          ),
        }}
        className="hover pointer"
        onClick={(e) => handleClick(e, "mentionNotification")}
        actionButton={
          <input
            type="checkbox"
            checked={user.settings.mentionNotification}
            onChange={() => {}}
          />
        }
      />
      <List
        data={{
          title: "Tweet Reply",
          subtitle: "Get notification when someone reply to your tweet",
          image: (
            <div className="text-primary py-2">
              <i className="bi bi-reply fs-2 mx-2"></i>
            </div>
          ),
        }}
        className="hover pointer"
        onClick={(e) => handleClick(e, "replyNotification")}
        actionButton={
          <input
            type="checkbox"
            checked={user.settings.replyNotification}
            onChange={() => {}}
          />
        }
      />
    </div>
  );
}
