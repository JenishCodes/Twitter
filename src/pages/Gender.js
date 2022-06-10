import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "../components/Header";

export default function Gender(props) {
  const [gender, setGender] = useState(props.gender);

  return (
    <div className="gender">
      <Helmet>
        <title>Gender / Twitter</title>
      </Helmet>
      <Header title="Gender" backArrow="full" />
      <div className="px-3">
        <div
          className="px-3 py-2 rounded-3 btn hover d-flex justify-content-between"
          onClick={() => setGender("male")}
        >
          <div>Male</div>
          {gender === "male" ? (
            <i className="bi bi-check-circle fs-3"></i>
          ) : (
            <i className="bi bi-circle fs-3"></i>
          )}
        </div>
        <div
          className="px-3 py-2 rounded-3 btn hover d-flex justify-content-between"
          onClick={() => setGender("female")}
        >
          <div>Female</div>
          {gender === "female" ? (
            <i className="bi bi-check-circle fs-3"></i>
          ) : (
            <i className="bi bi-circle fs-3"></i>
          )}
        </div>
        <div
          className="px-3 py-2 rounded-3 btn hover d-flex justify-content-between"
          onClick={() => setGender("other")}
        >
          <div>Other</div>
          {gender === "other" ? (
            <i className="bi bi-check-circle fs-3"></i>
          ) : (
            <i className="bi bi-circle fs-3"></i>
          )}
        </div>
      </div>
      <hr className="my-2" />
      <div className="rounded-0 py-2 btn w-100 hover">Update gender</div>
    </div>
  );
}
