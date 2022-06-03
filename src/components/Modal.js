import React from "react";

export default function Modal(props) {
  return (
    <div className="model-overlay w-100 h-100 position-fixed d-flex justify-content-center align-items-center top-0 start-0">
      <div className="model">{props.children}</div>
    </div>
  );
}
