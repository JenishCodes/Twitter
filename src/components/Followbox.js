import React from "react";
import List from "./List";

export function Followbox() {
  return (
    <div className="py-3 px-4">
      <div className="bg-muted" style={{ borderRadius: "15px" }}>
        <div className="py-1">
          <div className="fs-3 py-2 px-3 fw-bold">Who to follow</div>
        </div>
        <List
          className="hover pointer"
          data={{
            title: "Twitter",
            subtitle: "@twitter",
            image: (
              <div className="rounded-circle text-center w-100 h-100">
                <i className="bi bi-twitter fs-1" />
              </div>
            ),
          }}
        />
        <List
          className="hover pointer"
          data={{
            title: "Facebook",
            subtitle: "@meta",
            image: (
              <div className="rounded-circle text-center w-100 h-100">
                <i className="bi bi-facebook fs-1" />
              </div>
            ),
          }}
        />
        <List
          className="hover pointer"
          data={{
            title: "Gooogle",
            subtitle: "@alphabet",
            image: (
              <div className="rounded-circle text-center w-100 h-100">
                <i className="bi bi-google fs-1" />
              </div>
            ),
          }}
        />
        <List
          className="hover pointer"
          data={{
            title: "Microsoft",
            subtitle: "@microsoft",
            image: (
              <div className="rounded-circle text-center w-100 h-100">
                <i className="bi bi-microsoft fs-1" />
              </div>
            ),
          }}
        />
        <div
          className="btn hover pointer text-muted w-100 py-2"
          style={{ borderRadius: "0 0 15px 15px" }}
        >
          Show more
        </div>
      </div>
    </div>
  );
}
