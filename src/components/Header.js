import React from "react";
import { useNavigate } from "react-router-dom";
import Searchbar from "./Searchbar";

export default function Header(props) {
  const navigate = useNavigate();

  return props.title ? (
    <div
      className={`header px-2 position-sticky py-1`}
    >
      <div className="d-flex align-items-center">
        {props.backArrow ? (
          <div
            className="start btn hover rounded-circle px-2 py-0"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left-short fs-1"></i>
          </div>
        ) : null}
        <div className="title-container flex-grow-1 ms-2">
          <div className="title fs-3 fw-bold">{props.title}</div>
          {props.subtitle ? (
            <div className="subtitle fs-7 text-muted">{props.subtitle}</div>
          ) : null}
        </div>
        <div className="end">{props.endButton}</div>
      </div>
    </div>
  ) : (
    <div className="header p-2 position-sticky">
      <Searchbar />
    </div>
  );
}
