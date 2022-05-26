import React from "react";

export default function Modal(props) {
  return (
    <div className="model-overlay" style={{ background: props.bg_color }}>
      <div className="model">{props.children}</div>
    </div>
  );
}
