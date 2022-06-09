import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { getUser, getUserSettings } from "../services/user";
import { auth } from "./firebase";

export const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (res) => {
      if (res) {
        const user_res = await getUser(res.displayName);

        const userSettings = await getUserSettings(user_res.data._id);

        setUser({
          ...user_res.data,
          email: res.email,
          settings: userSettings.data,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, show, setShow }}>
      {children}
    </AuthContext.Provider>
  );
}
