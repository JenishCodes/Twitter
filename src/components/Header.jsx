import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context";
import Searchbar from "./Searchbar";

export default function Header(props) {
  const { user, setShow } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div
      className={`header px-2 position-sticky ${
        props.backArrow === "full"
          ? "py-1"
          : props.backArrow === "half"
          ? "py-sm-2"
          : "py-2"
      }`}
    >
      <div className="d-flex align-items-center">
        {props.backArrow ? (
          <div
            className={`start btn hover rounded-circle px-2 py-0 ${
              props.backArrow === "half" ? "d-sm-none" : ""
            }`}
            data-title="Back"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left-short fs-1"></i>
          </div>
        ) : (
          <div
            className="d-sm-none p-0 btn me-2"
            onClick={() => {
              document.body.style.overflowY = "hidden";
              setShow(true);
            }}
          >
            {user.isAnonymous ? (
              <i className="bi bi-twitter fs-2 px-2 py-1 text-app"></i>
            ) : (
              <img
                src={user.profile_image_url}
                className="profile-image rounded-circle square"
                alt="profile"
              />
            )}
          </div>
        )}
        {props.title ? (
          <div className="title-container flex-grow-1 ms-2">
            <div className="title fs-3 fw-bold">{props.title}</div>
            {props.subtitle && (
              <div className="subtitle fs-7 text-muted">{props.subtitle}</div>
            )}
          </div>
        ) : (
          <div className="flex-grow-1">
            <Searchbar />
          </div>
        )}
        <div className="end">{props.endButton}</div>
      </div>
      {props.extraTitle && (
        <div className="mt-2 py-1 fs-3 fw-bold px-2">{props.extraTitle}</div>
      )}
    </div>
  );
}
