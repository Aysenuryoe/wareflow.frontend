import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();


  const login = (token, userData) => {
    localStorage.setItem("token", token); // Token im localStorage speichern
    setUser(userData); // Benutzerinformationen setzen
    setIsAuthenticated(true); // Authentifizierungsstatus setzen
    navigate("/"); // Benutzer zur Startseite leiten
  };


  const logout = () => {
    localStorage.removeItem("token"); 
    setUser(null); 
    setIsAuthenticated(false);
    navigate("/login");
  };


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {

      fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Token ungültig");
          }
          return response.json();
        })
        .then((data) => {
          setUser(data); 
          setIsAuthenticated(true); 
        })
        .catch(() => {
          logout(); 
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
