import React from "react";

export default function Loading({ show, className, style, size }) {
  return show ? (
    <div className="text-center">
      <div
        className={"spinner-border " + className}
        style={{
          width:
            size === "small" ? "1rem" : size === "mediun" ? "20px" : "1.5rem",
          height:
            size === "small" ? "1rem" : size === "mediun" ? "20px" : "1.5rem",
          ...style,
        }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : null;
}
