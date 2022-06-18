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
import Display from "../pages/Display";
import Notifications from "../pages/Notifications";
import Drawer from "../components/Drawer";
import Explore from "../pages/Explore";
import { Followbox } from "../components/Followbox";
import Messages from "../pages/Messages";
import ConversationInfo from "../pages/ConversationInfo";
import AccountSettings from "../pages/AccountSettings";
import DeleteAccount from "../pages/DeleteAccount";

export default function AppNavigator() {
  return (
    <div className="app-screen d-flex justify-content-center">
      <Sidebar />
      <Drawer />
      <main className="main">
        <div className="row m-0 content">
          <div className="position-relative p-0 col-lg-7-2 col-sm-12">
            <Routes>
              <Route index element={<Navigate to="/home" />} />
              <Route path="home" element={<Home />} />
              <Route path="signin" element={<Navigate to="/home" />} />
              <Route path="signup" element={<Navigate to="/home" />} />
              <Route path="forgot" element={<Navigate to="/home" />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings">
                <Route index element={<Settings />} />
                <Route
                  path="account_name"
                  element={<AccountSettings settingType="accountName" />}
                />
                <Route
                  path="email"
                  element={<AccountSettings settingType="email" />}
                />
                <Route
                  path="password"
                  element={<AccountSettings settingType="password" />}
                />
                <Route path="display" element={<Display />} />
              </Route>
              <Route path="messages">
                <Route index element={<Messages />} />
                <Route path=":user_id">
                  <Route index element={<Conversation />} />
                  <Route path="info" element={<ConversationInfo />} />
                </Route>
              </Route>
              <Route path="bookmarks" element={<Bookmark />} />
              <Route path="explore" element={<Explore />} />
              <Route path="search/:search_type" element={<Search />} />
              <Route path="hashtag/:hashtag" element={<Hashtag />} />

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
              <Route path="logout" element={<Logout />} />

              <Route path="delete-account" element={<DeleteAccount />} />









            </Routes>
          </div>
          <div className="suggestion p-0 d-none d-lg-block col-lg-4-8 border-start h-100-vh top-0 position-sticky overflow-y-auto">
            <Routes>
              <Route path="/explore" element={<Followbox />} />
              <Route path="*" element={<Explore />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}
