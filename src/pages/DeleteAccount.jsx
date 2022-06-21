import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import { AuthContext } from "../context";
import { deleteUser } from "../services/user";

export default function DeleteAccount() {
  const { setUser, setToast } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (state?.requestFrom !== "settings") {
      navigate("/", { replace: true, state: null });
    }
  }, []);

  const handleDeactivate = (e) => {
    e.preventDefault();
    setLoading(true);
    deleteUser(password)
      .then(() => {
        setUser(null);
        navigate("/");
      })
      .catch((err) =>
        setToast({
          type: "danger",
          message: err.response.data,
        })
      )
      .finally(() => setLoading(false));
  };

  return state?.requestFrom === "settings" ? (
    <Modal>
      {loading ? (
        <div>
          <Loading show className="text-app" />
          <div className="text-muted fw-bold mt-3">Deleting Account...</div>
        </div>
      ) : (
        <div className="modal-body bg-primary p-4">
          <div className="text-center">
            <i className="bi bi-twitter text-app"></i>
          </div>
          <div className="fs-3 fw-bold">Deactivate Account?</div>
          <div className="text-muted py-2">
            After deactivating your account, your display name, @username, and
            public profile will no longer be viewable on Twitter.com.
          </div>
          <div className="form-floating my-3">
            <input
              type="password"
              className="form-control rounded-5 bg-transparent"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <label htmlFor="account-name-input">Confirm Password</label>
          </div>
          <div className="text-center d-flex">
            <div
              className={`btn bg-danger text-white filter pointer w-100 fw-bold rounded-pill me-1${
                password.length < 8 ? " disabled" : ""
              }`}
              onClick={handleDeactivate}
            >
              Deactivate
            </div>
            <div
              className="btn hover w-100 border fw-bold rounded-pill ms-1"
              onClick={() => navigate(-1, { replace: true, state: null })}
            >
              Cancle
            </div>
          </div>
        </div>
      )}
    </Modal>
  ) : null;
}
