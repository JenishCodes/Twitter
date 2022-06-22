import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Tabbar(props) {
  const navigate = useNavigate();
  const tabbar = useRef();

  return (
    <div className="tabbar" ref={tabbar}>
      <div className="header position-sticky">
        {props.title && (
          <div className="d-flex align-items-center py-1 px-2">
            {props.backArrow && (
              <div
                className="start btn hover rounded-circle py-0 px-2"
                onClick={() => navigate(-1)}
              >
                <i className="bi bi-arrow-left-short fs-1"></i>
              </div>
            )}
            <div className="title-container flex-grow-1 px-2">
              <div className="title fs-3 fw-bold">{props.title}</div>

              {props.subtitle && (
                <div className="subtitle fs-7 text-muted">{props.subtitle}</div>
              )}
            </div>
          </div>
        )}
        <div className="pages d-flex border-bottom overflow-x-auto">
          {props.tabs?.map((tab) => (
            <div
              key={tab.name}
              onClick={() => navigate(tab.path, { replace: true })}
              className="py-0 rounded-0 px-3 border-0 btn text-muted text-center hover flex-grow-1"
            >
              <div
                className={`tab flex-grow-1 m-auto py-2${
                  props.activeTab === tab.code ? " active" : ""
                }`}
              >
                {tab.name}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="current-tab">{props.children}</div>
      <div className="h-25-vh"></div>
    </div>
  );
}
