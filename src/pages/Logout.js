import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { logout } from "../services/user";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    logout().then(() => {
      navigate("/");
    });
  }, []);

  return (
    <Modal bg_color="var(--bg-primary)">
      <div className="spinner-grow text-app" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </Modal>
  );
}
