import React from "react";

export default function Loading({ show, className, style }) {
  return show ? (
    <div className="text-center">
      <div
        className={"spinner-border " + className}
        style={style}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : null;
}
