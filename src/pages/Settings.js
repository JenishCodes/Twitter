import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function Settings(props) {
  return (
    <div>
      <Header title="Settings" />
      <Link to="/settings/account">
        <div className="p-3 hover">
          <div className="d-flex justify-content-between">
            <div>Your Account</div>
            <div>
              <i className="fa fa-chevron-right"></i>
            </div>
          </div>
        </div>
      </Link>
      <Link to="/settings/security">
        <div className="p-3 hover">
          <div className="d-flex justify-content-between">
            <div>Security</div>
            <div>
              <i className="fa fa-chevron-right"></i>
            </div>
          </div>
        </div>
      </Link>
      <Link to="/settings/privacy">
        <div className="p-3 hover">
          <div className="d-flex justify-content-between">
            <div>Privacy and safety</div>
            <div>
              <i className="fa fa-chevron-right"></i>
            </div>
          </div>
        </div>
      </Link>
      <Link to="/settings/display">
        <div className="p-3 hover">
          <div className="d-flex justify-content-between">
            <div>Display and accessibility</div>
            <div>
              <i className="fa fa-chevron-right"></i>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
