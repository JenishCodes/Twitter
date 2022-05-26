import React from "react";
import { useNavigate } from "react-router-dom";

export default function Trend({ hashtag, tweets, noAction }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        !noAction ? navigate(`/hashtag/${hashtag.replace("#", "")}`) : null
      }
    >
      <div className="trend hover px-3 py-2">
        <div className="d-flex align-items-center">
          <div className="rounded-circle border me-3">
            <i className="bi bi-hash fs-1 p-2"></i>
          </div>
          <div>
            <div className="text-primary">{hashtag}</div>
            {tweets ? <div className="text-muted">{tweets} Tweets</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
