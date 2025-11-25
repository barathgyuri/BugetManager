import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("ft_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("ft_token") || null);

  // Initialize axios on mount
  React.useMemo(() => {
    // Use an environment-provided API base URL in production, otherwise rely on
    // dev server proxy (so `/api` works in development).
    if (import.meta?.env?.VITE_API_URL) {
      axios.defaults.baseURL = import.meta.env.VITE_API_URL;
    }

    // Add a request interceptor to always include the current token from localStorage
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("ft_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("ft_token", token);
    } else {
      localStorage.removeItem("ft_token");
    }
    if (user) localStorage.setItem("ft_user", JSON.stringify(user));
    else localStorage.removeItem("ft_user");
  }, [token, user]);

  // login can be called in two ways by the app:
  // 1) login({ token, user }) -- called when a component already has the token/user (Register.jsx)
  // 2) await login(email, password, isRegister) -- called from Login.jsx which expects an async
  //    function that performs the network request for login or register
  const login = async (...args) => {
    // Case 1: passed an object with token and user
    console.log("auth context");
    
    if (args.length === 1 && args[0] && typeof args[0] === "object" && args[0].token) {
      const { token, user } = args[0];
      setToken(token);
      setUser(user);
      console.log("1")
      return { token, user };
    }

    // Case 2: perform login/register request
    const [email, password, isRegister] = args;
    try {
      const url = isRegister ? "/api/auth/register" : "/api/auth/login";
      const res = await axios.post(url, { email, password });
      const data = res.data;
      // Expecting { token, user } from server
      if (data?.token && data?.user) {
        setToken(data.token);
        setUser(data.user);
      }
      console.log("2")
      return data;
    } catch (err) {
      // rethrow so calling components can handle the error
      console.log("3")
      throw err;
    }
      console.log("4")
  };
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
}
