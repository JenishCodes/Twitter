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
import { DEFAULT_USERS } from "../utils";

export default function AccountSettings() {
  const [accountName, setAccountName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const { user, setUser, setToast } = useContext(AuthContext);
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
    if (DEFAULT_USERS === user.account_name) {
      setToast({
        type: "danger",
        message:
          "You can't update account credentials because it is one of default users.",
      });
      return;
    }

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
      .catch((err) => setToast({ message: err.response.data, type: "danger" }))
      .finally(() => setLoading(false));
  };

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

      <div className="px-3">
        <div className="form-floating my-3">
          <input
            type="password"
            className="form-control rounded-5 bg-transparent"
            id="password"
            disabled={loading}
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <label htmlFor="password">Password</label>
        </div>
        <div className="form-floating my-3">
          <input
            type={setting_type === "account-name" ? "text" : setting_type}
            className="form-control rounded-5 bg-transparent"
            id="field-input"
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
          <label htmlFor="field-input">
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
              className="form-control rounded-5 bg-transparent"
              id="confirm-password"
              disabled={loading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
            />
            <label htmlFor="confirm-password">Confirm Password</label>
          </div>
        )}
      </div>
      <hr className="my-2" />
      <div
        className={`rounded-0 py-2 btn w-100 hover d-flex justify-content-center${
          loading ||
          password.length < 8 ||
          (setting_type === "password" &&
            (newPassword.length < 8 || newPassword !== confirmPassword)) ||
          (setting_type === "email" && (!email || email === user.email)) ||
          (setting_type === "account-name" &&
            (!accountName || accountName === user.account_name))
            ? " disabled"
            : ""
        }`}
        onClick={handleSubmit}
      >
        <Loading show={loading} className="me-3" size="medium" />

        {setting_type === "email"
          ? "Update email"
          : setting_type === "password"
          ? "Update password"
          : "Update account name"}
      </div>
    </div>
  );
}
