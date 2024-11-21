import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Product";
import Sales from "./pages/Sales";
import Purchases from "./pages/Purchase";
import Inventory from "./pages/Inventory";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";

import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      {" "}
      <AuthProvider>
        {" "}
        <Routes>
          <Route path="/login" element={<Login />} />

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
