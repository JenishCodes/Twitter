import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../config/context";
import Modal from "./Modal";

export default function Drawer() {
  const { user, setShow, show } = useContext(AuthContext);
  const navigate = useNavigate();

  return show ? (
    <div className="d-sm-none">
      <Modal style={{ height: "100%", width: "100%" }}>
        <div id="drawer" className="drawer position-fixed bg-primary h-100">
          <div className="drawer-header d-flex justify-content-between align-items-center px-3 pt-3">
            <div className="drawer-header-title fs-4 fw-bold">{user.isAnonymous?"Twitter":"Account info"}</div>
            <div
              className="drawer-header-icon hover rounded-circle px-2 py-0 btn"
              onClick={() => {
                document.body.style.overflowY = "scroll";
                setShow(false);
              }}
            >
              <i className="bi bi-x fs-2"></i>
            </div>
          </div>

          {!user.isAnonymous ? (
            <div className="drawer-header p-3">
              <div className="profile-image mb-1">
                <img
                  src={user.profile_image_url}
                  className="w-100 rounded-circle"
                  alt="profile"
                />
              </div>
              <div className="fw-bold fs-4">{user.name}</div>
              <div className="text-muted mb-3">@{user.account_name}</div>
              <div className="d-flex fs-6">
                <div className="me-3">
                  <span className="fw-bold">{user.following_count} </span>
                  <span className="text-muted">Following</span>
                </div>
                <div>
                  <span className="fw-bold">{user.followers_count} </span>
                  <span className="text-muted">Followers</span>
                </div>
              </div>
            </div>
          ) : null}

          {user.isAnonymous ? <hr className="mb-0 mt-3" /> : <hr className="my-0" />}
          
          {user.isAnonymous ? (
            <div className="drawer-body py-1">
              <div
                className="drawer-item d-flex btn py-2 px-3 rounded-0 align-items-center hover"
                onClick={() => {
                  document.body.style.overflowY = "scroll";
                  setShow(false);
                  navigate("/explore");
                }}
              >
                <div className="drawer-item-icon fs-3 me-3">
                  <i className="bi bi-hash"></i>
                </div>
                <div className="drawer-item-text fs-4">Explore</div>
              </div>
              <div
                className="drawer-item d-flex btn py-2 px-3 rounded-0 align-items-center hover"
                onClick={() => {
                  document.body.style.overflowY = "scroll";
                  setShow(false);
                  navigate("/settings/display");
                }}
              >
                <div className="drawer-item-icon fs-3 me-3">
                  <i className="bi bi-brush"></i>
                </div>
                <div className="drawer-item-text fs-4">Display</div>
              </div>
            </div>
          ) : (
            <div className="drawer-body py-1">
              <div
                className="drawer-item d-flex btn py-2 px-3 rounded-0 align-items-center hover"
                onClick={() => {
                  document.body.style.overflowY = "scroll";
                  setShow(false);
                  navigate("/" + user.account_name);
                }}
              >
                <div className="drawer-item-icon fs-3 me-3">
                  <i className="bi bi-person"></i>
                </div>
                <div className="drawer-item-text fs-4">Profile</div>
              </div>
              <div
                className="drawer-item d-flex btn py-2 px-3 rounded-0 align-items-center hover"
                onClick={() => {
                  document.body.style.overflowY = "scroll";
                  setShow(false);
                  navigate("/bookmarks");
                }}
              >
                <div className="drawer-item-icon fs-3 me-3">
                  <i className="bi bi-bookmark"></i>
                </div>
                <div className="drawer-item-text fs-4">Bookmark</div>
              </div>
              <div
                className="drawer-item d-flex btn py-2 px-3 rounded-0 align-items-center hover"
                onClick={() => {
                  document.body.style.overflowY = "scroll";
                  setShow(false);
                  navigate("/settings/display");
                }}
              >
                <div className="drawer-item-icon fs-3 me-3">
                  <i className="bi bi-brush"></i>
                </div>
                <div className="drawer-item-text fs-4">Display</div>
              </div>
              <div
                className="drawer-item d-flex btn py-2 px-3 rounded-0 align-items-center hover"
                onClick={() => {
                  document.body.style.overflowY = "scroll";
                  setShow(false);
                  navigate("/settings");
                }}
              >
                <div className="drawer-item-icon fs-3 me-3">
                  <i className="bi bi-gear"></i>
                </div>
                <div className="drawer-item-text fs-4">Settings</div>
              </div>
            </div>
          )}
          <hr className="my-1" />
          <div className="drawer-footer">
            <div
              className="drawer-item rounded-0 text-danger d-flex btn py-2 px-3 align-items-center hover"
              onClick={() => {
                document.body.style.overflowY = "scroll";
                setShow(false);
                navigate("/logout");
              }}
            >
              <div className="drawer-item-icon fs-3 me-3">
                <i className="bi bi-box-arrow-right"></i>
              </div>
              <div className="drawer-item-text fs-4">Logout</div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  ) : null;
}
