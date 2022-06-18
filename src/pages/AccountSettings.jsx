import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import {
  resetPassword,
  updateAccountName,
  updateUserEmail,
} from "../services/user";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Loading from "../components/Loading";
import { AuthContext } from "../context";

export default function AccountSettings({ settingType }) {
  const [accountName, setAccountName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setAccountName(user.account_name);
    setEmail(user.email);
  }, []);

  const handleSubmit = () => {
    setLoading(true);

    (settingType === "account"
      ? updateAccountName(accountName, password).then(() =>
          setUser({ ...user, account_name: accountName })
        )
      : settingType === "email"
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
          {settingType === "accountName"
            ? "Change account name "
            : settingType === "email"
            ? "Change email "
            : "Update password "}
          / Twitter
        </title>
      </Helmet>
      <Header
        title={
          settingType === "accountName"
            ? "Change account name "
            : settingType === "email"
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
            type={settingType === "accountName" ? "text" : settingType}
            className="form-control rounded-5"
            style={{ backgroundColor: "transparent" }}
            disabled={loading}
            value={
              settingType === "password"
                ? newPassword
                : settingType === "email"
                ? email
                : accountName
            }
            onChange={(e) =>
              (settingType === "email"
                ? setEmail
                : settingType === "password"
                ? setNewPassword
                : setAccountName)(e.currentTarget.value)
            }
          />
          <label htmlFor="account-name-input">
            {settingType === "email"
              ? "Email"
              : settingType === "password"
              ? "New Password"
              : "Account Name"}
          </label>
        </div>
        {settingType === "password" && (
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
          (settingType === "password" &&
            (!password || !confirmPassword || password !== confirmPassword)) ||
          (settingType === "email" && (!email || email === user.email)) ||
          (settingType === "accountName" &&
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
        {settingType === "email"
          ? "Update email"
          : settingType === "password"
          ? "Update password"
          : "Update account name"}
      </div>
    </div>
  );
}
