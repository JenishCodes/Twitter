import React, { useEffect, useState } from "react";
import { timeConverter } from "../utils";

export default function Message(props) {
  const [time, setTime] = useState("");
  const { message, align, handleDelete, lastTime } = props;

  useEffect(() => {
    setTime(timeConverter(message.createdAt, lastTime));
  }, []);

  return (
    <div className="text-message-container w-100 pb-1">
      <div className={`d-flex text-message justify-content-${align}`}>
        {align === "end" ? (
          <div
            className="message-delete btn hover me-3"
            onClick={() => {
              handleDelete(message._id);
            }}
            style={{ height: "fit-content" }}
          >
            <i className="bi bi-trash text-muted"></i>
          </div>
        ) : null}
        <div
          style={{
            width: "fit-content",
            maxWidth: "80%",
            borderRadius: "15px",
          }}
          className="px-3 py-2 text-white bg-app"
        >
          {message.text}
        </div>
      </div>
      {time ? (
        <div className="message-time text-muted text-end fs-7 mb-2">{time}</div>
      ) : null}
    </div>
  );
}
