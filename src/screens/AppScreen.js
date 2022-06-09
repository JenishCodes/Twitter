import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Conversation from "../pages/Coversation";
import Sidebar from "../components/Sidebar";
import Network from "../pages/Network";
import Search from "../pages/Search";
import Settings from "../pages/Settings";
import Status from "../pages/Status";
import User from "../pages/User";
import Logout from "../pages/Logout";
import EditProfile from "../pages/EditProfile";
import Reactions from "../pages/Reactions";
import Hashtag from "../pages/Hashtag";
import Bookmark from "../pages/Bookmark";
import Chat from "../pages/Chat";
import Account from "../pages/Account";
import NotificationSettings from "../pages/NotificationSettings";
import Privacy from "../pages/Privacy";
import Display from "../pages/Display";
import AccountName from "../pages/AccountName";
import Email from "../pages/Email";
import Country from "../pages/Country";
import Gender from "../pages/Gender";
import Phone from "../pages/Phone";
import Trending from "../pages/Trending";
import Notifications from "../pages/Notifications";
import Drawer from "../components/Drawer";

export default function AppScreen() {
  return (
    <div className="app-screen d-flex justify-content-center">
      <Sidebar />
      <Drawer />
      <main className="main">
        <div className="row m-0 content">
          <div className="position-relative p-0 col-lg-7-2 col-sm-12">
            <Routes>
              <Route index element={<Navigate to="/home" />} />
              <Route path="signin" element={<Navigate to="/home" />} />
              <Route path="signup" element={<Navigate to="/home" />} />
              <Route path="forgot" element={<Navigate to="/home" />} />

              <Route path="logout" element={<Logout />} />

              <Route path="home" element={<Home />} />

              <Route
                path="trending"
                element={
                  window.screen.width > 991 ? (
                    <Navigate to="/notifications" replace />
                  ) : (
                    <Trending />
                  )
                }
              />

              <Route path="notifications" element={<Notifications />} />

              <Route path="bookmarks" element={<Bookmark />} />

              <Route path="search/:search_type" element={<Search />} />

              <Route path="hashtag/:hashtag" element={<Hashtag />} />

              <Route path="messages">
                <Route index element={<Chat />} />
                <Route path=":user_id" element={<Conversation />} />
              </Route>

              <Route path="settings">
                <Route index element={<Settings />} />
                <Route path="account">
                  <Route index element={<Account />} />
                  <Route path="account_name" element={<AccountName />} />
                  <Route path="email" element={<Email />} />
                  <Route path="country" element={<Country />} />
                  <Route path="gender" element={<Gender />} />
                  <Route path="phone" element={<Phone />} />
                </Route>
                <Route path="notifications" element={<NotificationSettings />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="display" element={<Display />} />
              </Route>

              <Route path=":account_name">
                <Route index element={<User />} />
                <Route path=":profile_type" index element={<User />} />
                <Route path="status/:status_id">
                  <Route index element={<Status />} />
                  <Route path=":reaction_type" element={<Reactions />} />
                </Route>
                <Route path="network/:friendship_type" element={<Network />} />
                <Route path="edit" element={<EditProfile />} />
              </Route>
            </Routes>
          </div>
          <div className="suggestion p-0 d-none d-lg-block col-lg-4-8 border-start h-100-vh top-0 position-sticky overflow-y-auto">
            <Trending />
          </div>
        </div>
      </main>
    </div>
  );
}
