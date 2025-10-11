import { createContext, useState, useEffect } from "react";
import { postLogin } from "../api/postLogin";
import { useContext } from "react";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const loginUser = (credentials) => {
    setLoading(true);
    setAuthError(null);

    return postLogin(credentials)
      .then((data) => {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
      })
      .catch((err) => {
        console.error("Login failed:", err.msg || err.message);
        setAuthError(err.msg || "Login failed");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const registerUser = (newUserData) => {
    setLoading(true);
    setAuthError(null);

    return postRegister(newUserData)
      .then((data) => {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
      })
      .catch((err) => {
        console.error("Registration failed:", err.msg || err.message);
        setAuthError(err.msg || "Registration failed");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <AuthContext.Provider
      value={{ user, loginUser, registerUser, logoutUser, authError, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
