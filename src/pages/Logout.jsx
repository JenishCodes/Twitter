import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import { AuthContext } from "../context";
import { logout } from "../services/user";

export default function Logout() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <Modal>
      {loading ? (
        <div>
          <Loading
            show
            style={{ width: "1.5rem", height: "1.5rem" }}
            className="text-app"
          />
          <div className="text-muted fw-bold mt-3">Logging out...</div>
        </div>
      ) : (
        <div
          className="modal-body bg-primary p-4"
          style={{
            width: "320px",
            borderRadius: "20px",
            maxWidth: "80vw",
            height: "auto",
          }}
        >
          <div className="text-center">
            <i
              className="bi bi-twitter text-app"
              style={{ fontSize: "3rem" }}
            ></i>
          </div>
          <div className="fs-3 fw-bold">Log out of Twitter?</div>
          <div className="text-muted py-2">
            You can always log back in at any time. If you just want to switch
            accounts, you can do that by adding an existing account.
          </div>
          <div className="text-center">
            <div
              className="btn bg-secondary text-secondary filter pointer w-100 fw-bold rounded-pill mt-2 mb-1"
              onClick={() => {
                setLoading(true);
                logout(user.isAnonymous)
                  .then(() => {
                    setLoading(false);
                    navigate("/");
                  })
                  .catch((err) => {
                    setLoading(false);
                    console.log(err);
                  });
              }}
            >
              Logout
            </div>
            <div
              className="btn hover w-100 border fw-bold rounded-pill mt-1 mb-2"
              onClick={() => {
                navigate(-1);
              }}
            >
              Cancle
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
