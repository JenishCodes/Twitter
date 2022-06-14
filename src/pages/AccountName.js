import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import { updateAccountName } from "../services/user";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Loading from "../components/Loading";
import { AuthContext } from "../config/context";

export default function AccountName() {
  const { user } = useContext(AuthContext);
  const [accountName, setAccountName] = useState("");
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => setAccountName(state.account_name), []);

  const handleSubmit = () => {
    setLoading(true);
    updateAccountName(user._id, accountName)
      .then(() => navigate("/settings/account", { replace: true }))
      .catch((err) => setToast(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (toast) setTimeout(() => setToast(""), 5000);
  }, [toast]);

  return (
    <div>
      <Helmet>
        <title>Change account name / Twitter</title>
      </Helmet>
      <Header title="Change account name" backArrow="full" />
      {toast ? (
        <div
          className="text-white bg-danger rounded-3 p-2 position-absolute"
          style={{
            width: "300px",
            left: "50%",
            bottom: "5%",
            transform: "translateX(-50%)",
          }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <i className="bi bi-exclamation-circle fs-2"></i>
              <div className="ms-2">{toast}</div>
            </div>
            <div
              onClick={() => setToast(null)}
              className="btn-close pointer btn-close-white me-2 m-auto"
            ></div>
          </div>
        </div>
      ) : null}
      <div className="px-3">
        <div className="form-floating my-3">
          <input
            type="text"
            className="form-control rounded-5"
            style={{ backgroundColor: "transparent" }}
            disabled={loading}
            value={accountName}
            onChange={(e) => setAccountName(e.currentTarget.value)}
          />
          <label htmlFor="account-name-input">Account Name</label>
        </div>
      </div>
      <hr className="my-2" />
      <div
        className={`rounded-0 py-2 btn w-100 hover d-flex justify-content-center ${
          loading ? "disabled" : ""
        }`}
        onClick={handleSubmit}
      >
        <Loading
          show={loading}
          className="me-3"
          style={{ width: "20px", height: "20px" }}
        />
        Update account name
      </div>
    </div>
  );
}
