import React, { useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../context";
import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";
import AnonymousNavigator from "./AnonymousNavigator";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { getUser, getUserSettings } from "../services/user";

export default function Navigator() {
  const { user, loading, setScrollY, setUser, setLoading, socket } =
    useContext(AuthContext);

  useEffect(() => {
    window.addEventListener("scroll", () => setScrollY(window.scrollY));
    return () =>
      window.removeEventListener("scroll", () => setScrollY(window.scrollY));
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (res) => {
      if (res) {
        if (res.isAnonymous) {
          setUser(res);
        } else {
          const user_res = await getUser(res.displayName);

          const userSettings = await getUserSettings(user_res._id);

          setUser({
            ...user_res,
            email: res.email,
            settings: userSettings,
            isAnonymous: false,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && !user.isAnonymous) {
      socket.current = io(
        process.env.REACT_APP_SERVER_API || "http://127.0.0.1:3001"
      );
      socket.current.emit("add-user", user._id);
    }
  }, [user]);

  return loading ? (
    <div className="d-flex justify-content-center align-items-center h-100-vh">
      <i className="bi bi-twitter fs-0 text-app"></i>
    </div>
  ) : user ? (
    user.isAnonymous ? (
      <AnonymousNavigator />
    ) : (
      <AppNavigator />
    )
  ) : (
    <AuthNavigator />
  );
}
