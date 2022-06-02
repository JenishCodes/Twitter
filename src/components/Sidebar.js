import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../config/context";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const { pathname } = useLocation();

  return user ? (
    <header
      role="banner"
      className="sidebar ps-sm-0 ps-lg-0 d-flex justify-content-end position-relative"
    >
      <div className="position-relative">
        <div className="position-fixed h-100 h-sm-auto w-inherit bottom-sm-0 bg-primary">
          <div className="d-flex flex-sm-column px-xl-3 px-1 justify-content-between h-100">
            <div className="d-flex flex-sm-column flex-grow-1 align-items-center">
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
                <Link
                  to="/home"
                  className="nav hover rounded-pill mx-auto mx-xl-0 py-2 align-items-center ps-3 fs-3 pe-xl-4 pe-3 text-primary btn"
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
                </Link>
              </div>

              <div className="w-100 d-lg-none">
                <Link
                  to="/trending"
                  style={{ padding: "1.25px 11.5px" }}
                  className="nav hover rounded-pill mx-auto align-items-center text-primary btn"
                >
                  <div className="nav-icon">
                    <i
                      className={`bi bi-hash ${
                        pathname === "/trending" ? "fw-blod" : ""
                      }`}
                      style={{ fontSize: "36px" }}
                    ></i>
                  </div>
                </Link>
              </div>

              <div className="w-100">
                <Link
                  to="/notifications"
                  className="nav hover rounded-pill mx-auto mx-xl-0 py-2 align-items-center ps-3 fs-3 pe-xl-4 pe-3 text-primary btn"
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
                </Link>
              </div>
              <div className="w-100">
                <Link
                  to="/messages"
                  className="nav hover rounded-pill mx-auto mx-xl-0 py-2 align-items-center ps-3 fs-3 pe-xl-4 pe-3 text-primary btn"
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
                </Link>
              </div>

              <div className="w-100 d-none d-sm-block">
                <Link
                  to="/bookmarks"
                  className="nav hover rounded-pill mx-auto mx-xl-0 py-2 align-items-center ps-3 fs-3 pe-xl-4 pe-3 text-primary btn"
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
                </Link>
              </div>
              <div className="w-100 d-none d-sm-block">
                <Link
                  to={"/" + user.account_name}
                  className="nav hover rounded-pill mx-auto mx-xl-0 py-2 align-items-center ps-3 fs-3 pe-xl-4 pe-3 text-primary btn"
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
                </Link>
              </div>
              <div className="w-100 d-none d-sm-block">
                <Link
                  to="/settings"
                  className="nav hover rounded-pill mx-auto mx-xl-0 py-2 align-items-center ps-3 fs-3 pe-xl-4 pe-3 text-primary btn"
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
                </Link>
              </div>
              <div className="w-100 mt-2 d-none d-sm-block">
                <Link
                  to="/"
                  className="nav hover rounded-pill w-100 mx-auto bg-app py-2 fs-3 text-white btn"
                >
                  <div className="nav-icon d-xl-none mx-auto">
                    <i className="bi bi-plus-circle"></i>
                  </div>
                  <span className="nav-title d-xl-block mx-auto d-none">
                    Tweet
                  </span>
                </Link>
              </div>
            </div>
            <Link className="hover rounded-pill btn my-3 p-2 d-none d-sm-block" to="/logout">
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
            </Link>
          </div>
        </div>
      </div>
    </header>
  ) : null;
}
