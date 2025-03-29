import React, { useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../context";
import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";
import {
  getUserFromId,
  getUserSettings,
  isAuthenticated,
} from "../services/user";
import Toast from "../components/Toast";

export default function Navigator() {
  const { user, loading, setScrollY, setUser, setLoading, socket } =
    useContext(AuthContext);

  const fetchUser = async () => {
    const { _id: userId } = isAuthenticated();

    if (userId) {
      if (userId === "anonymous") {
        setUser({ isAnonymous: true });
      } else {
        const user_res = await getUserFromId(userId);

        const userSettings = await getUserSettings();

        setUser({
          ...user_res,
          settings: userSettings,
          isAnonymous: false,
        });
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", () => setScrollY(window.scrollY));
    return () =>
      window.removeEventListener("scroll", () => setScrollY(window.scrollY));
  }, []);

  useEffect(() => {
    fetchUser().then(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user && !user.isAnonymous) {
      socket.current = io(
        process.env.REACT_APP_API_URL
      );
      socket.current.emit("user-added", user._id);
    }
  }, [user]);

  return loading ? (
    <div className="d-flex justify-content-center align-items-center h-100-vh">
      <i className="bi bi-twitter fs-0 text-app"></i>
    </div>
  ) : (
    <div>
      <Toast />
      {user ? <AppNavigator /> : <AuthNavigator />}
    </div>
  );
}
