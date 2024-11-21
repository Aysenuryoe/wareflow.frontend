// src/components/Sidebar.jsx

import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();
  return (
    <aside className="sidebar">
      <nav className="sidebar__nav">
        <ul className="sidebar__list">
          <li className="sidebar__item">
            <Link to="/" className="sidebar__link">
              <i className="sidebar__icon fas fa-tachometer-alt"></i> Dashboard
            </Link>
          </li>
          <li className="sidebar__item">
            <Link to="/products" className="sidebar__link">
              <i className="sidebar__icon fas fa-box"></i> Products
            </Link>
          </li>
          <li className="sidebar__item">
            <Link to="/sales" className="sidebar__link">
              <i className="sidebar__icon fas fa-shopping-cart"></i> Sales
            </Link>
          </li>
          <li className="sidebar__item">
            <Link to="/purchases" className="sidebar__link">
              <i className="sidebar__icon fas fa-chart-line"></i> Purchases
            </Link>
          </li>
          <li className="sidebar__item">
            <Link to="/inventory" className="sidebar__link">
              <i className="sidebar__icon fas fa-warehouse"></i> Inventory
            </Link>
          </li>
          <li className="sidebar__item">
            <Link to="/settings" className="sidebar__link">
              <i className="sidebar__icon fas fa-cog"></i> Settings
            </Link>
          </li>
          <li className="sidebar__item sidebar__item--last">
            <button
              className="sidebar__button sidebar__button--logout"
              onClick={logout}
            >
              <i className="sidebar__icon fas fa-sign-out-alt"></i> Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
