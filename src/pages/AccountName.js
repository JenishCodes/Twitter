import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { AuthContext } from "../config/context";
import { editProfile } from "../services/user";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function AccountName() {
  const { user } = useContext(AuthContext);
  const [accountName, setAccountName] = useState("");
  const navigate = useNavigate();

  useEffect(() => setAccountName(user.account_name), [user.account_name]);

  const handleClick = () => {
    editProfile({ account_name: accountName })
      .then(() => navigate("/settings/account", { replace: true }))
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Helmet><title>Change account name / Twitter</title></Helmet>
      <Header title="Change account name" backArrow="full" />
      <div className="px-3">
        <div className="form-floating my-3">
          <input
            type="text"
            className="form-control rounded-5"
            id="account-name-input"
            style={{ backgroundColor: "transparent" }}
            value={accountName}
            onChange={(e) => setAccountName(e.currentTarget.value)}
          />
          <label htmlFor="account-name-input">Account Name</label>
        </div>
      </div>
      <hr className="my-2" />
      <div className="rounded-0 py-2 btn w-100 hover" onClick={handleClick}>
        Update account name
      </div>
    </div>
  );
}
