import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { getUser } from "../services/user";
import { auth } from "./firebase";

export const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (res) => {
      if (res) {
        const user_res = await getUser(res.displayName);
        setUser({ ...user_res.data, email: res.email });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
