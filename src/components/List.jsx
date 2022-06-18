import React from "react";

export default function List(props) {
  return props.data ? (
    <div
      className={"list px-3 py-2 " + props.className}
      onClick={props.onClick}
    >
      <div className="d-flex">
        <div className="me-3 image">
          {props.data.image ? (
            props.data.image
          ) : props.data.image_url ? (
            <img
              className="w-100 h-auto rounded-circle square"
              src={props.data.image_url}
              alt=""
            />
          ) : null}
        </div>
        <div className="details align-self-center">
          <div className="d-flex align-items-center justify-content-between">
            <div className="w-100">
              {props.data.title ? (
                <div className="fw-bold">{props.data.title}</div>
              ) : null}
              {props.data.subtitle ? (
                <div className="text-muted oneline">{props.data.subtitle}</div>
              ) : null}
            </div>
            {props.actionButton ? (
              <div className="ms-3">{props.actionButton}</div>
            ) : null}
          </div>
          {props.data.context ? <div>{props.data.context}</div> : null}
        </div>
      </div>
    </div>
  ) : null;
}