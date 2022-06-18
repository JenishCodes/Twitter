import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import List from "../components/List";
import { AuthContext } from "../context";
import { updateUserSettings } from "../services/user";

export default function Settings() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const handleClick = (e, type) => {
    e.preventDefault();
    updateUserSettings({ [type]: !user.settings[type] })
      .then(() => {
        const settings = { ...user.settings, [type]: !user.settings[type] };
        setUser({ ...user, settings });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Helmet>
        <title>Settings / Twitter</title>
      </Helmet>
      <Header title="Settings" backArrow="half" />
      <div>
        <div className="text-muted my-2 py-1 fw-bold px-3">
          Account Settings
        </div>
        <List
          data={{
            title: "Username",
            subtitle: "@" + user.account_name,
            image: (
              <div className="py-2">
                <i className="bi bi-person-fill fs-2 mx-2"></i>
              </div>
            ),
          }}
          className="hover pointer"
          onClick={() =>
            navigate("account_name", {
              state: { account_name: user.account_name },
            })
          }
          actionButton={<i className="bi bi-chevron-right text-muted"></i>}
        ></List>
        <List
          data={{
            title: "Email",
            subtitle: user.email,
            image: (
              <div className="py-2">
                <i className="bi bi-envelope fs-2 mx-2"></i>
              </div>
            ),
          }}
          className="hover pointer"
          onClick={() => navigate("email", { state: { email: user.email } })}
          actionButton={<i className="bi bi-chevron-right text-muted"></i>}
        ></List>
        <List
          data={{
            title: "Update Password",
            image: (
              <div className="py-2">
                <i className="bi bi-key fs-2 mx-2"></i>
              </div>
            ),
          }}
          className="hover pointer"
          onClick={() => navigate("password")}
          actionButton={<i className="bi bi-chevron-right text-muted"></i>}
        ></List>
      </div>
      <div className="border-top">
        <div className="text-muted my-2 py-1 fw-bold px-3">
          Notifications Settings
        </div>
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
            subtitle:
              "Get notification when someone mention you in their tweet",
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
      <div className="border-top">
        <div className="text-muted my-2 py-1 fw-bold px-3">
          Privacy Settings
        </div>
        <List
          data={{
            title: "Tweet Tag",
            subtitle: user.settings.canTag
              ? "Anyone can tag you"
              : "Only your followings can tag you",
            image: (
              <div className="text-primary py-2">
                <i className="bi bi-at fs-2 mx-2"></i>
              </div>
            ),
          }}
          className="hover pointer"
          onClick={(e) => handleClick(e, "canTag")}
          actionButton={
            <input
              type="checkbox"
              onChange={() => {}}
              checked={user.settings.canTag}
            />
          }
        />
        <List
          data={{
            title: "Direct Message",
            subtitle: user.settings.canMessage
              ? "Anyone can tag you"
              : "Only your followings can tag you",
            image: (
              <div className="text-primary py-2">
                <i className="bi bi-envelope-fill fs-2 mx-2"></i>
              </div>
            ),
          }}
          className="hover pointer"
          onClick={(e) => handleClick(e, "canMessage")}
          actionButton={
            <input
              type="checkbox"
              onChange={() => {}}
              checked={user.settings.canMessage}
            />
          }
        />
      </div>
      <div className="border-top">
        <div className="text-muted my-2 py-1 fw-bold px-3">
          Display Settings
        </div>
        <List
          data={{
            title: "Display and accessibility",
            image: (
              <div className="text-primary py-2">
                <i className="bi bi-brush fs-2 mx-2"></i>
              </div>
            ),
          }}
          className="hover pointer"
          onClick={() => navigate("display")}
          actionButton={<i className="bi bi-chevron-right text-muted"></i>}
        />
      </div>
      <div className="border-top">
        <div className="text-muted my-2 py-1 fw-bold px-3">Account Actions</div>
        <List
          className="hover pointer"
          data={{
            title: "Logout from Twitter",
            image: (
              <div className="py-2">
                <i className="bi bi-box-arrow-right fs-2 mx-2"></i>
              </div>
            ),
          }}
          onClick={() => navigate("/logout")}
          actionButton={<i className="bi bi-chevron-right text-muted"></i>}
        ></List>
        <List
          className="hover pointer text-danger"
          data={{
            title: "Delete account permanently",
            image: (
              <div className="text-danger py-2">
                <i className="bi bi-trash fs-2 mx-2"></i>
              </div>
            ),
          }}
          onClick={() =>
            navigate("/delete-account", { state: { requestFrom: "settings" } })
          }
          actionButton={<i className="bi bi-chevron-right text-muted"></i>}
        ></List>
      </div>
    </div>
  );
}
