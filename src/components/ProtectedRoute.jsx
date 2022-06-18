import React from "react";
import { Navigate, Route } from "react-router-dom";
import { isAuthenticated } from "../services/user";

export default function ProtectedRoute({
  path,
  isAnonymous,
  Element,
  ...rest
}) {
  const { _id: user } = isAuthenticated();
  return (
    <Route
      path={path}
      {...rest}
      element={
        !user ? (
          <Navigate to="/signin" />
        ) : isAnonymous ? (
          <Element />
        ) : user !== "anonymous" ? (
          <Element />
        ) : (
          <Navigate to="/explore" />
        )
      }
    />
  );
}
