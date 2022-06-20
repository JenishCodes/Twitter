import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Forgot from "../pages/Forgot";
import Main from "../pages/Main";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";

export default function AuthNavigator() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) setTimeout(() => setToast(null), 5000);
  }, [toast]);

  return (
    <div className="auth-screen d-flex position-relative">
      <div className="col-7 d-none bg-app d-lg-flex justify-content-center align-items-center position-fixed h-100">
        <div className="text-white" style={{ fontSize: "300px" }}>
          <i className="bi bi-twitter"></i>
        </div>
      </div>
      <main className="col-lg-5 col-12 position-absolute end-lg-0 m-auto">
        {toast ? (
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
        ) : null}
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="signin" element={<Signin setToast={setToast} />} />
          <Route path="signup" element={<Signup setToast={setToast} />} />
          <Route path="forgot" element={<Forgot setToast={setToast} />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
