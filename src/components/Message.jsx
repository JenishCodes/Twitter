import React from "react";
import { timeFormatter } from "../utils";

export default function Message(props) {
  const { message, align, handleDelete, shape } = props;

  return (
    <div className="text-message-container w-100 mb-1">
      <div
        className={`d-flex text-message align-items-center justify-content-${align}`}
      >
        {align === "end" && (
          <div
            className="message-delete btn hover me-2 py-1 px-2"
            onClick={() => handleDelete(message._id)}
            data-title="Delete"
          >
            <i className="bi bi-trash text-muted fs-6"></i>
          </div>
        )}
        <div
          className={`message-text white-space-pre-line ${
            align === "end" ? "bg-app text-white" : "bg-muted text-primary"
          }`}
          style={{
            borderRadius:
              align === "end"
                ? shape === "single"
                  ? "20px"
                  : shape === "first"
                  ? "20px 20px 0px 20px"
                  : shape === "last"
                  ? "20px 0 20px 20px"
                  : "20px 0px 0px 20px"
                : shape === "single"
                ? "20px"
                : shape === "first"
                ? "20px 20px 20px 0px"
                : shape === "last"
                ? "0 20px 20px 20px"
                : "0 20px 20px 0",
          }}
        >
          {message.text}
        </div>
      </div>
      {message.date && (
        <div className={`message-time text-muted text-${align} fs-7 mb-3 mt-1`}>
          {timeFormatter(message.createdAt, "Message")}
        </div>
      )}
    </div>
  );
}
