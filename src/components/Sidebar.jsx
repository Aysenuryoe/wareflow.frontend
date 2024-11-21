import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/">
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/products">
              <i className="fas fa-box"></i> Products
            </Link>
          </li>
          <li>
            <Link to="/sales">
              <i className="fas fa-shopping-cart"></i>
              Sales
            </Link>
          </li>
          <li>
            <Link to="/purchases">
              <i className="fas fa-chart-line"></i>Purchases
            </Link>
          </li>
          <li>
            <Link to="/inventory">
              <i className="fas fa-warehouse"></i> Inventory
            </Link>
          </li>
          <li>
            <Link to="/settings">
              <i className="fas fa-cog"></i> Settings
            </Link>
          </li>
          <li>
            <Link to="/logout">
              <i className="fas fa-sign-out-alt"></i> Logout
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
