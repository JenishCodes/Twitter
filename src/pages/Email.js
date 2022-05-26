import React, { useState } from "react";
import Header from "../components/Header";

export default function Email(props) {
  const [email, setEmail] = useState(props.email);

  return (
    <div className="email">
      <Header title="Change Email" backArrow />
      <div className="px-3">
        <div className="form-floating my-3">
          <input
            type="text"
            className="form-control rounded-5"
            id="email-input"
            style={{ backgroundColor: "transparent" }}
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <label htmlFor="email-input">Email</label>
        </div>
      </div>
      <hr className="my-2" />
      <div className="rounded-0 py-2 btn w-100 hover">Update email</div>
    </div>
  );
}
