import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context";

export default function Toast() {
  const { toast, setToast } = useContext(AuthContext);

  useEffect(() => {
    if (toast) setTimeout(() => setToast(null), 5000);
  }, [toast]);

  return toast ? (
    <div
      className={`toast-container text-white bg-${toast.type} rounded-3 p-2 position-fixed`}
    >
      <div className="d-flex">
        <i
          className={`bi bi-${
            toast.type === "danger" ? "exclamation" : "info"
          }-circle fs-2 mx-1`}
        ></i>
        <div className="mx-2 align-self-center flex-grow-1">
          {toast.message}
        </div>
        <div
          onClick={() => setToast(null)}
          className="btn-close pointer btn-close-white m-1"
        ></div>
      </div>
    </div>
  ) : null;
}
