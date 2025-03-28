import React, { useRef, useState } from "react";

export const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [toast, setToast] = useState(null);
  const socket = useRef();

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        show,
        setShow,
        setLoading,
        scrollY,
        socket,
        setScrollY,
        toast,
        setToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
