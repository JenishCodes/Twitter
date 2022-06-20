import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import {
  resetPassword,
  updateAccountName,
  updateUserEmail,
} from "../services/user";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Loading from "../components/Loading";
import { AuthContext } from "../context";

export default function AccountSettings() {
  const [accountName, setAccountName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(AuthContext);
  const { setting_type } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      setting_type !== "account-name" &&
      setting_type !== "email" &&
      setting_type !== "password"
    ) {
      navigate("/settings");
    }
    setAccountName(user.account_name);
    setEmail(user.email);
  }, []);

  const handleSubmit = () => {
    setLoading(true);

    (setting_type === "account-name"
      ? updateAccountName(accountName, password).then(() =>
          setUser({ ...user, account_name: accountName })
        )
      : setting_type === "email"
      ? updateUserEmail(email, password).then(() => setUser({ ...user, email }))
      : resetPassword(password, newPassword)
    )
      .then(() => navigate("/settings", { replace: true }))
      .catch((err) => setToast(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (toast) setTimeout(() => setToast(""), 5000);
  }, [toast]);

  return (
    <div>
      <Helmet>
        <title>
          {setting_type === "account-name"
            ? "Change account name "
            : setting_type === "email"
            ? "Change email "
            : "Update password "}
          / Twitter
        </title>
      </Helmet>
      <Header
        title={
          setting_type === "account-name"
            ? "Change account name "
            : setting_type === "email"
            ? "Change email "
            : "Update password "
        }
        backArrow="full"
      />
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
            type="password"
            className="form-control rounded-5"
            id="account-name-input"
            disabled={loading}
            style={{ backgroundColor: "transparent" }}
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <label htmlFor="account-name-input">Password</label>
        </div>
        <div className="form-floating my-3">
          <input
            type={setting_type === "account-name" ? "text" : setting_type}
            className="form-control rounded-5"
            style={{ backgroundColor: "transparent" }}
            disabled={loading}
            value={
              setting_type === "password"
                ? newPassword
                : setting_type === "email"
                ? email
                : accountName
            }
            onChange={(e) =>
              (setting_type === "email"
                ? setEmail
                : setting_type === "password"
                ? setNewPassword
                : setAccountName)(e.currentTarget.value)
            }
          />
          <label htmlFor="account-name-input">
            {setting_type === "email"
              ? "Email"
              : setting_type === "password"
              ? "New Password"
              : "Account Name"}
          </label>
        </div>
        {setting_type === "password" && (
          <div className="form-floating my-3">
            <input
              type="password"
              className="form-control rounded-5"
              disabled={loading}
              style={{ backgroundColor: "transparent" }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
            />
            <label htmlFor="account-name-input">Confirm Password</label>
          </div>
        )}
      </div>
      <hr className="my-2" />
      <div
        className={`rounded-0 py-2 btn w-100 hover d-flex justify-content-center ${
          loading ||
          !password ||
          (setting_type === "password" &&
            (!password || !confirmPassword || password !== confirmPassword)) ||
          (setting_type === "email" && (!email || email === user.email)) ||
          (setting_type === "account-name" &&
            (!accountName || accountName === user.account_name))
            ? "disabled"
            : ""
        }`}
        onClick={handleSubmit}
      >
        <Loading
          show={loading}
          className="me-3"
          style={{ width: "20px", height: "20px" }}
        />
        {setting_type === "email"
          ? "Update email"
          : setting_type === "password"
          ? "Update password"
          : "Update account name"}
      </div>
    </div>
  );
}
