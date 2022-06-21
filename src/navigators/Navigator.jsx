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

export default function Navigator() {
  const {
    user,
    loading,
    setScrollY,
    setUser,
    setLoading,
    socket,
    toast,
    setToast,
  } = useContext(AuthContext);

  useEffect(() => {
    window.addEventListener("scroll", () => setScrollY(window.scrollY));
    return () =>
      window.removeEventListener("scroll", () => setScrollY(window.scrollY));
  }, []);

  useEffect(async () => {
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
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && !user.isAnonymous) {
      socket.current = io(
        process.env.REACT_APP_SERVER_API || "http://127.0.0.1:3001"
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
      {toast && (
        <div
          className={`text-white bg-${toast.type} rounded-3 p-2 position-fixed`}
          style={{
            width: "300px",
            left: "50%",
            top: "5%",
            transform: "translateX(-50%)",
            zIndex: 5,
          }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <i className="bi bi-exclamation-circle fs-2"></i>
              <div className="ms-2">{toast.message}</div>
            </div>
            <div
              onClick={() => setToast(null)}
              className="btn-close pointer btn-close-white me-2 m-auto"
            ></div>
          </div>
        </div>
      )}
      {user ? (
        <AppNavigator isAnonymous={user.isAnonymous} />
      ) : (
        <AuthNavigator />
      )}
    </div>
  );
}
