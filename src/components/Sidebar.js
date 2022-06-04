import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../config/context";
import Editor from "./Editor";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const { pathname } = useLocation();
  const [show, setShow] = useState(true);
  const [compose, setCompose] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShow(
      !["/home", "/messages", "/notifications", "/trending"].includes(pathname)
    );
  }, [pathname]);

  return user ? (
    <header
      role="banner"
      className={`sidebar ps-sm-0 ps-lg-0 d-flex justify-content-end position-relative d-sm-block ${
        show ? "d-none" : ""
      }`}
    >
      <div className="position-relative">
        <Editor show={compose} setShow={setCompose} />
        <div className="position-fixed h-100 h-sm-auto w-inherit bottom-sm-0 bg-primary">
          <div className="d-flex flex-sm-column px-xl-3 px-1 justify-content-between h-100">
            <div className="d-flex flex-sm-column flex-grow-1 align-items-center py-sm-0 py-1">
              <div className="w-100 d-none d-sm-block">
                <Link to="/home">
                  <div className="px-3 mx-auto mx-xl-0 hover py-2 nav rounded-pill py-2 align-items-center p-3 text-primary btn">
                    <div className="m-0 nav-icon">
                      <i className="bi bi-twitter"></i>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="w-100">
                <div
                  className="nav hover rounded-pill mx-auto mx-xl-0 py-sm-2 py-0 align-items-center px-2 px-sm-3 fs-3 pe-xl-4 text-primary btn"
                  onClick={() => navigate("/home")}
                >
                  <div className="nav-icon">
                    <i
                      className={`bi bi-house-door${
                        pathname === "/home" ? "-fill" : ""
                      }`}
                    ></i>
                  </div>
                  <span
                    className={`nav-title d-xl-block d-none ${
                      pathname === "/home" ? "fw-bold" : ""
                    }`}
                  >
                    Home
                  </span>
                </div>
              </div>

              <div className="w-100 d-lg-none">
                <div
                  onClick={() => navigate("/trending")}
                  className="nav hover rounded-pill mx-auto py-sm-1 py-0 align-items-center px-2 text-primary btn"
                >
                  <div className="nav-icon mx-sm-1">
                    <i
                      className={`fs-1 bi bi-hash ${
                        pathname === "/trending" ? "fw-blod" : ""
                      }`}
                    ></i>
                  </div>
                </div>
              </div>

              <div className="w-100 d-sm-none d-block">
                <div
                  onClick={() => {
                    document.body.style.overflowY = "hidden";
                    setCompose(true);
                  }}
                  className="nav hover rounded-pill mx-auto mx-xl-0 py-sm-2 py-0 align-items-center px-sm-3 fs-3 pe-xl-4 px-2 text-primary bg-app btn"
                >
                  <div className="nav-icon">
                    <i className="bi bi-plus-circle"></i>
                  </div>
                </div>
              </div>
              <div className="w-100">
                <div
                  onClick={() => navigate("/notifications")}
                  className="nav hover rounded-pill mx-auto mx-xl-0 py-sm-2 py-0 align-items-center px-sm-3 fs-3 pe-xl-4 px-2 text-primary btn"
                >
                  <div className="nav-icon">
                    <i
                      className={`bi bi-bell${
                        pathname === "/notifications" ? "-fill" : ""
                      }`}
                    ></i>
                  </div>
                  <span
                    className={`nav-title d-xl-block d-none ${
                      pathname === "/notifications" ? "fw-bold" : ""
                    }`}
                  >
                    Notifications
                  </span>
                </div>
              </div>
              <div className="w-100">
                <div
                  onClick={() => navigate("/messages")}
                  className="nav hover rounded-pill mx-auto mx-xl-0 py-sm-2 py-0 align-items-center px-sm-3 fs-3 pe-xl-4 px-2 text-primary btn"
                >
                  <div className="nav-icon">
                    <i
                      className={`bi bi-envelope${
                        pathname.startsWith("/messages") ? "-fill" : ""
                      }`}
                    ></i>
                  </div>
                  <span
                    className={`nav-title d-xl-block d-none ${
                      pathname.startsWith("/messages") ? "fw-bold" : ""
                    }`}
                  >
                    Messages
                  </span>
                </div>
              </div>

              <div className="w-100 d-none d-sm-block">
                <div
                  onClick={() => navigate("/bookmarks")}
                  className="nav hover rounded-pill mx-auto mx-xl-0 py-sm-2 align-items-center px-sm-3 fs-3 pe-xl-4 text-primary btn"
                >
                  <div className="nav-icon">
                    <i
                      className={`bi bi-bookmark${
                        pathname === "/bookmarks" ? "-fill" : ""
                      }`}
                    ></i>
                  </div>
                  <span
                    className={`nav-title d-xl-block d-none ${
                      pathname === "/bookmarks" ? "fw-bold" : ""
                    }`}
                  >
                    Bookmarks
                  </span>
                </div>
              </div>
              <div className="w-100 d-none d-sm-block">
                <div
                  onClick={() => navigate("/" + user.account_name)}
                  className="nav hover rounded-pill mx-auto mx-xl-0 py-sm-2 align-items-center px-sm-3 fs-3 pe-xl-4 text-primary btn"
                >
                  <div className="nav-icon">
                    <i
                      className={`bi bi-person${
                        pathname.startsWith("/" + user.account_name)
                          ? "-fill"
                          : ""
                      }`}
                    ></i>
                  </div>
                  <span
                    className={`nav-title d-xl-block d-none ${
                      pathname.startsWith("/" + user.account_name)
                        ? "fw-bold"
                        : ""
                    }`}
                  >
                    Profile
                  </span>
                </div>
              </div>
              <div className="w-100 d-none d-sm-block">
                <div
                  onClick={() => navigate("/settings")}
                  className="nav hover rounded-pill mx-auto mx-xl-0 py-sm-2 align-items-center px-sm-3 fs-3 pe-xl-4 text-primary btn"
                >
                  <div className="nav-icon">
                    <i
                      className={`bi bi-gear${
                        pathname.startsWith("/settings") ? "-fill" : ""
                      }`}
                    ></i>
                  </div>
                  <span
                    className={`nav-title d-xl-block d-none ${
                      pathname.startsWith("/settings") ? "fw-bold" : ""
                    }`}
                  >
                    Settings
                  </span>
                </div>
              </div>
              <div className="w-100 mt-2 d-none d-sm-block">
                <div
                  to="/"
                  onClick={() => {
                    document.body.style.overflowY = "hidden";
                    setCompose(true);
                  }}
                  className="nav hover compose-btn rounded-pill mx-auto bg-app py-2 fs-3 text-white btn"
                >
                  <div className="nav-icon d-xl-none mx-auto">
                    <i className="bi bi-plus-circle"></i>
                  </div>
                  <span className="nav-title d-xl-block mx-auto d-none">
                    Tweet
                  </span>
                </div>
              </div>
            </div>
            <div
              onClick={() => navigate("/logout")}
              className="hover rounded-pill btn my-3 p-2 d-none d-sm-block"
            >
              <div className="d-flex align-items-center">
                <div className="profile-image mx-auto me-xl-3">
                  <img
                    src={user.profile_image_url}
                    className="w-100 rounded-circle"
                    alt="profile"
                  />
                </div>
                <div className="d-xl-flex d-none flex-grow-1 align-items-center">
                  <div className="flex-grow-1 text-start">
                    <div className="fw-bold">{user.name}</div>
                    <div className="text-muted">@{user.account_name}</div>
                  </div>
                  <div className="p-1">
                    <i className="bi bi-three-dots fs-3"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  ) : null;
}
