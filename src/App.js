import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout"; // Layout-Komponente
import Dashboard from "./pages/Dashboard"; // Seiten
import Products from "./pages/Product";
import Sales from "./pages/Sales";
import Purchases from "./pages/Purchase";
import Inventory from "./pages/Inventory";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Authentifizierungskontext

import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Prüft, ob der Benutzer angemeldet ist
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      {" "}
      {/* Router für Navigation */}
      <AuthProvider>
        {" "}
        {/* Kontext für die Authentifizierung */}
        <Routes>
          {/* Öffentliche Route: Login */}
          <Route path="/login" element={<Login />} />

          {/* Geschützte Routen: */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <Layout>
                  <Products />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <PrivateRoute>
                <Layout>
                  <Sales />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/purchases"
            element={
              <PrivateRoute>
                <Layout>
                  <Purchases />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <PrivateRoute>
                <Layout>
                  <Inventory />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
