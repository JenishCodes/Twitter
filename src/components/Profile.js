import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../config/context";
import { getFriendship, follow, unfollow } from "../services/friendship";

export default function Profile(props) {
  const { user } = useContext(AuthContext);
  const [freindshipStatus, setFriendshipStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user._id !== props.user._id) {
      getFriendship(user._id, props.user._id).then((friendship) => {
        if (friendship.data) {
          setFriendshipStatus("Following");
        } else {
          setFriendshipStatus("Follow");
        }
      });
    } else {
      setFriendshipStatus("Edit Profile");
    }
  }, [user, props.user]);

  const handleClick = () => {
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

  return props.user ? (
    <div className="profile">
      <div className="poster">
        <img
          className="w-100 h-100"
          src={props.user.banner_image_url}
          alt="banner"
        />
      </div>
      <div className="photo-btn d-flex justify-content-between px-3">
        <div className="photo w-25">
          <img
            className="w-100 rounded-circle"
            src={props.user.profile_image_url}
            alt="profile"
          />
        </div>
        <div className="btns pt-2">
          <div className="btn text-primary px-2 py-1 rounded-circle border hover">
            <i className="bi bi-three-dots fs-3"></i>
          </div>
          <div className="btn text-primary rounded-circle hover border px-2 py-1 mx-2">
            <i
              className="bi bi-envelope fs-3"
              onClick={() => navigate("/messages/" + props.user._id, { state: { user: props.user } })}
            ></i>
          </div>
          <div
            className={`btn hover ${
              freindshipStatus === "Follow" ? "bg-app text-secondary" : ""
            } rounded-pill border px-3`}
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
        <div className="description my-2">
          <p>{props.user.description}</p>
        </div>
        <div className="info d-flex my-2">
          {props.user.location ? (
            <div className="text-muted me-4">
              <i className="bi bi-geo-alt-fill fs-4 me-2"></i>
              <span>{props.user.location}</span>
            </div>
          ) : null}
          <div className="text-muted me-4">
            <i className="bi bi-calendar-fill me-2 fs-4"></i>
            <span>Joined {new Date(props.user.createdAt).toDateString()}</span>
          </div>
          {props.user.url ? (
            <div className="text-muted me-4">
              <i className="bi bi-link me-2 fs-4"></i>
              <span>{props.user.url}</span>
            </div>
          ) : null}
        </div>
        <div className="statics d-flex mt-3 mb-2">
          <Link to={`/${props.user.account_name}/network/following`} state={props.user}>
            <div className="d-flex me-4">
              <span>{props.user.following_count}</span>
              <span className="text-muted ms-1">Following</span>
            </div>
          </Link>
          <Link to={`/${props.user.account_name}/network/followers`} state={props.user}>
            <div className="d-flex">
              <span>{props.user.followers_count}</span>
              <span className="text-muted ms-1">Followers</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-100 py-5 text-center">
      <div
        className="spinner-border spinner-border-sm text-app m-auto"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
