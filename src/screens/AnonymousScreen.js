import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Network from "../pages/Network";
import Search from "../pages/Search";
import Status from "../pages/Status";
import User from "../pages/User";
import Logout from "../pages/Logout";
import Reactions from "../pages/Reactions";
import Hashtag from "../pages/Hashtag";
import Display from "../pages/Display";
import Drawer from "../components/Drawer";
import Explore from "../pages/Explore";
import { Authbox } from "../components/Authbox";

export default function AnonymousScreen() {
  return (
    <div className="app-screen d-flex justify-content-center">
      <Sidebar />
      <Drawer />
      <main className="main">
        <div className="row m-0 content">
          <div className="position-relative p-0 col-lg-7-2 col-sm-12">
            <Routes>
              <Route index element={<Navigate to="/explore" />} />
              <Route path="home" element={<Navigate to="/explore" />} />
              <Route path="signin" element={<Navigate to="/explore" />} />
              <Route path="signup" element={<Navigate to="/explore" />} />
              <Route path="forgot" element={<Navigate to="/explore" />} />
              <Route
                path="notifications"
                element={<Navigate to="/explore" />}
              />
              <Route path="settings">
                <Route path="display" element={<Display />} />
                <Route path="*" element={<Navigate to="/explore" />} />
              </Route>
              <Route path="messages/*" element={<Navigate to="/explore" />} />
              <Route path="bookmarks" element={<Navigate to="/explore" />} />

              <Route path="explore" element={<Explore />} />

              <Route path="search/:search_type" element={<Search />} />

              <Route path="hashtag/:hashtag" element={<Hashtag />} />

              <Route path="display" element={<Display />} />

              <Route path=":account_name">
                <Route index element={<User />} />
                <Route path=":profile_type" index element={<User />} />
                <Route path="status/:status_id">
                  <Route index element={<Status />} />
                  <Route path=":reaction_type" element={<Reactions />} />
                </Route>
                <Route path="network/:friendship_type" element={<Network />} />
                <Route path="edit" element={<Navigate to="/explore" />} />
              </Route>

              <Route path="logout" element={<Logout />} />
            </Routes>
          </div>
          <div className="suggestion p-0 d-none d-lg-block col-lg-4-8 border-start h-100-vh top-0 position-sticky overflow-y-auto">
            <Routes>
              <Route path="/explore" element={<Authbox />} />
              <Route path="*" element={<Explore />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}
