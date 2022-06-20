import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context";
import { getRelationship, follow, unfollow } from "../services/friendship";
import Modal from "./Modal";

export default function Profile(props) {
  const { user } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [freindshipStatus, setFriendshipStatus] = useState("Follow");
  const [imageUrl, setImageUrl] = useState(null);
  const [imageType, setImageType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isAnonymous) return;

    if (user._id !== props.user._id) {
      getRelationship(user._id, props.user._id).then((friendship) => {
        setFriendshipStatus(friendship.action);
      });
    } else setFriendshipStatus("Edit Profile");
  }, [user, props.user]);

  const handleClick = () => {
    if (user.isAnonymous) {
      navigate("/login");
      return;
    }

    if (freindshipStatus === "Following") {
      unfollow(user._id, props.user._id)
        .then(() => setFriendshipStatus("Follow"))
        .catch((err) => console.log(err));
    } else if (freindshipStatus === "Edit Profile") {
      navigate(`/${user.account_name}/edit`);
    } else {
      follow(user._id, props.user._id)
        .then(() => setFriendshipStatus("Following"))
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="profile">
      <div className="poster overflow-hidden bg-muted">
        {props.user.banner_image_url ? (
          <img
            className="pointer w-100 h-100"
            src={props.user.banner_image_url}
            alt="banner"
            onClick={() => {
              document.body.style.overflowY = "hidden";
              setImageUrl(props.user.banner_image_url);
              setImageType("banner");
              setShow(true);
            }}
          />
        ) : null}
      </div>
      <div className="photo-btn d-flex justify-content-between px-3">
        <div className="photo w-25">
          <img
            className="pointer w-100 rounded-circle square"
            src={props.user.profile_image_url}
            alt="profile"
            onClick={() => {
              document.body.style.overflowY = "hidden";
              setImageUrl(props.user.profile_image_url);
              setImageType("profile");
              setShow(true);
            }}
          />
        </div>
        <div className="btns pt-2">
          {user.isAnonymous ? null : (
            <div
              className="btn text-primary rounded-circle hover border px-2 py-1 mx-2"
              data-title={"Message @" + props.user.account_name}
              onClick={() =>
                navigate("/messages/" + props.user._id, {
                  state: { user: props.user },
                })
              }
            >
              <i className="bi bi-envelope fs-3"></i>
            </div>
          )}
          <div
            className={`btn border hover fw-bold ${
              freindshipStatus === "Follow" ? "bg-app text-white" : ""
            } rounded-pill px-3`}
            onClick={handleClick}
          >
            {freindshipStatus}
          </div>
        </div>
      </div>
      <div className="details px-3">
        <div className="username my-2">
          <div className="fs-3 fw-bold">{props.user.name}</div>
          <div className="text-muted">@{props.user.account_name}</div>
        </div>
        <div className="description white-space-pre-line my-2">
          <p>{props.user.description}</p>
        </div>
        <div className="info d-flex my-2 flex-wrap">
          {props.user.location ? (
            <div className="text-muted me-4 my-1">
              <i className="bi bi-geo-alt-fill fs-4 me-2"></i>
              <span>{props.user.location}</span>
            </div>
          ) : null}
          <div className="text-muted me-4 my-1">
            <i className="bi bi-calendar-fill me-2 fs-4"></i>
            <span>Joined {new Date(props.user.createdAt).toDateString()}</span>
          </div>
          {props.user.url ? (
            <div className="text-muted me-4 my-1">
              <i className="bi bi-link me-2 fs-4"></i>
              <Link to={props.user.url} target="_blank">
                {props.user.url}
              </Link>
            </div>
          ) : null}
        </div>
        <div className="statics d-flex mt-3 mb-2">
          <Link
            className="hover-underline"
            to={`/${props.user.account_name}/network/following`}
            state={props.user}
          >
            <div className="d-flex me-4">
              <span>{props.user.following_count}</span>
              <span className="text-muted ms-1">Following</span>
            </div>
          </Link>
          <Link
            className="hover-underline"
            to={`/${props.user.account_name}/network/followers`}
            state={props.user}
          >
            <div className="d-flex">
              <span>{props.user.followers_count}</span>
              <span className="text-muted ms-1">Followers</span>
            </div>
          </Link>
        </div>
      </div>
      {show ? (
        <Modal style={{ width: "100%", height: "100%" }}>
          <div className="position-absolute p-3">
            <div
              className="btn hover px-2 py-0 rounded-circle"
              onClick={() => {
                setShow(false);
                document.body.style.overflowY = "scroll";
              }}
            >
              <i className="bi bi-x fs-1"></i>
            </div>
          </div>
          <div className="d-flex flex-column align-items-center h-100 justify-content-center">
            <div
              className="w-100"
              style={{
                maxHeight: "400px",
                maxWidth: imageType === "profile" ? "400px" : "100%",
              }}
            >
              <img
                className={`h-100 w-100${
                  imageType === "profile" ? " rounded-circle" : ""
                }`}
                src={imageUrl}
                alt="profile"
              />
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
