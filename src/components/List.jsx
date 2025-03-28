import React from "react";

export default function List({ data, className, actionButton, onClick }) {
  return data ? (
    <div className={`list px-3 py-2 ${className}`} onClick={onClick}>
      <div className="d-flex align-items-center">
        <div className="me-3 image align-self-start">
          {data.image
            ? data.image
            : data.image_url && (
                <img
                  className="w-100 h-auto rounded-circle square"
                  src={data.image_url}
                  alt=""
                />
              )}
        </div>
        <div className="details">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              {data.title && <div className="fw-bold">{data.title}</div>}
              {data.subtitle && (
                <div className="text-muted">{data.subtitle}</div>
              )}
            </div>
            {actionButton && <div className="ms-3">{actionButton}</div>}
          </div>
          {data.context}
        </div>
      </div>
    </div>
  ) : null;
}
