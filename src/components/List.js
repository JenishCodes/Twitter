import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function List(props) {
  const navigate = useNavigate();

  return props.data ? (
    <div
      className={"list px-3 py-2 " + props.className}
      onClick={() =>
        props.action
          ? navigate(props.action, { state: props.actionState })
          : null
      }
    >
      <div className="d-flex align-items-center">
        {props.data.image ? (
          props.data.image
        ) : props.data.image_url ? (
          <div className="me-3 image">
            <img
              className="w-100 h-auto rounded-circle"
              src={props.data.image_url}
              alt=""
            />
          </div>
        ) : null}
        <div className="flex-grow-1 details">
          <div className="d-flex align-items-center justify-content-between">
            <div className="w-75">
              <div className="fw-bold">{props.data.title}</div>
              {props.data.subtitle ? (
                <div className="text-muted oneline">{props.data.subtitle}</div>
              ) : null}
            </div>
            <div className="ms-3">{props.actionButton ? props.actionButton : null}</div>
          </div>
          {props.data.context ? <div>{props.data.context}</div> : null}
        </div>
      </div>
    </div>
  ) : null;
}
