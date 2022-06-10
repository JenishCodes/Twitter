import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "../components/Header";

export default function Phone(props) {
  const [phone, setPhone] = useState(props.phone);

  return (
    <div>
      <Helmet><title>Change phone / Twitter</title></Helmet>

      <Header title="Change phone" backArrow="full" />
      <div className="px-3">
        <div className="form-floating my-3">
          <input
            type="text"
            className="form-control rounded-5"
            id="phone-input"
            style={{ backgroundColor: "transparent" }}
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
          />
          <label htmlFor="phone-input">Phone</label>
        </div>
      </div>
      <hr className="my-2" />
      <div className="rounded-0 py-2 btn w-100 hover">Update phone</div>
    </div>
  );
}
