import React, { useContext } from "react";
import Header from "../components/Header";
import List from "../components/List";
import { AuthContext } from "../config/context";

export default function Privacy() {
  const { user, setUser } = useContext(AuthContext);

  const handleClick = (e, type) => {
    e.preventDefault();
    const settings = { ...user.settings, [type]: !user.settings[type] };
    setUser({ ...user, settings });
  };

  return (
    <div>
      <Header title="Privacy" backArrow="full" />
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
  );
}
