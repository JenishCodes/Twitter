import React from "react";
import { useNavigate } from "react-router-dom";

export default function Tabbar(props) {
  const navigate = useNavigate();

  return (
    <div className="tabbar">
      <div className="header position-sticky">
        <div className="d-flex align-items-center py-1 px-2">
          {props.backArrow ? (
            <div
              className="start btn hover rounded-circle py-0 px-2"
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left-short fs-1"></i>
            </div>
          ) : null}
          <div className="title-container flex-grow-1 px-2">
            {props.title ? (
              <div className="title fs-3 fw-bold">{props.title}</div>
            ) : null}
            {props.subtitle ? (
              <div className="subtitle fs-7 text-muted">{props.subtitle}</div>
            ) : null}
          </div>
        </div>
        <div className="pages d-flex justify-content-evenly border-bottom overflow-x-auto">
          {props.tabs
            ? props.tabs.map((tab) => (
                <div
                  key={tab.name}
                  onClick={() => navigate(tab.path, { replace: true })}
                  className="p-0 mx-3 border-0 btn text-muted text-center"
                >
                  <div
                    className={
                      props.activeTab === tab.code
                        ? "tab m-auto py-2 active rounded"
                        : "tab m-auto py-2"
                    }
                  >
                    {tab.name}
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
      <div className="current-tab">{props.children}</div>
    </div>
  );
}
