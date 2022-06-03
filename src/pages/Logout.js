import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import { logout } from "../services/user";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    logout()
      .then(() => navigate("/"))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Modal bgColor="rgba(0, 0, 0, 0.4)">
      <Loading
        show
        style={{ width: "1.5rem", height: "1.5rem" }}
        className="text-app"
      />
    </Modal>
  );
}
