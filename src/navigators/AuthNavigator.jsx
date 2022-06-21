import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Forgot from "../pages/Forgot";
import Main from "../pages/Main";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";

export default function AuthNavigator() {
  return (
    <div className="auth-screen d-flex position-relative">
      <div className="col-7 d-none bg-app d-lg-flex justify-content-center align-items-center position-fixed h-100">
        <div className="text-white" style={{ fontSize: "300px" }}>
          <i className="bi bi-twitter"></i>
        </div>
      </div>
      <main className="col-lg-5 col-12 position-absolute end-lg-0 m-auto">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot" element={<Forgot />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
