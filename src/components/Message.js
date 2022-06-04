import React, { useEffect, useState } from "react";
import { timeFormatter } from "../utils";

export default function Message(props) {
  const [time, setTime] = useState("");
  const { message, align, handleDelete, nextTime } = props;

  useEffect(() => {
    setTime(
      timeFormatter(message.createdAt.seconds * 1000, true, false, nextTime)
    );
  }, []);

  return (
    <div className="text-message-container w-100 mb-1">
      <div className={`d-flex text-message justify-content-${align}`}>
        {align === "end" ? (
          <div
            className="message-delete btn hover me-3"
            onClick={() => handleDelete(message._id)}
            style={{ height: "fit-content" }}
          >
            <i className="bi bi-trash text-muted"></i>
          </div>
        ) : null}
        <div
          style={{
            width: "fit-content",
            maxWidth: "80%",
            borderRadius: nextTime
              ? time
                ? "16px 16px 0px 16px"
                : "16px 0px 0px 16px"
              : "16px 0px 16px 16px",
          }}
          className="px-3 py-2 text-white bg-app"
        >
          {message.text}
        </div>
      </div>
      {time ? (
        <div className={`message-time text-muted text-${align} fs-7 mb-3 mt-1`}>
          {time}
        </div>
      ) : null}
    </div>
  );
}
