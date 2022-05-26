import React, { useContext } from "react";
import { AuthContext } from "../config/context";
import AppScreen from "./AppScreen";
import AuthScreen from "./AuthScreen";
import "../style.css";

export default function Navigator() {
  const { user, loading } = useContext(AuthContext);

  return loading ? (
    <div className="d-flex justify-content-center align-items-center h-100-vh">
      <i className="bi bi-twitter fs-0 text-app"></i>
    </div>
  ) : user ? (
    <AppScreen />
  ) : (
    <AuthScreen />
  );
}
