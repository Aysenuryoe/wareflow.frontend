import React from "react";
import { FaBoxOpen, FaChartLine, FaShoppingCart, FaWarehouse, FaCogs } from "react-icons/fa";
import "../styles/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1 className="dashboard__title">Inventory Management Dashboard</h1>
        <p className="dashboard__subtitle">
          Efficiently manage your orders, sales, and inventory with ease.
        </p>
      </header>

      <main className="dashboard__main">
        <section className="dashboard__intro">
          <p>
            Use the navigation bar on the left to explore the different modules of the system. Here you can:
          </p>
          <ul className="dashboard__features">
            <li className="dashboard__feature-item">
              <FaBoxOpen className="dashboard__icon" />
              Add and manage products
            </li>
            <li className="dashboard__feature-item">
              <FaChartLine className="dashboard__icon" />
              Track and analyze sales
            </li>
            <li className="dashboard__feature-item">
              <FaShoppingCart className="dashboard__icon" />
              Plan and review purchases
            </li>
            <li className="dashboard__feature-item">
              <FaWarehouse className="dashboard__icon" />
              Monitor inventory levels
            </li>
          </ul>
          <p>
            Get started by selecting a module or check out the latest features in the settings menu!
          </p>
        </section>

        <section className="dashboard__stats">
          <div className="dashboard__card">
            <FaBoxOpen className="dashboard__card-icon" />
            <div className="dashboard__card-content">
              <h3>Products</h3>
              <p>Manage your product catalog efficiently.</p>
            </div>
          </div>
          <div className="dashboard__card">
            <FaChartLine className="dashboard__card-icon" />
            <div className="dashboard__card-content">
              <h3>Sales</h3>
              <p>Analyze your sales performance.</p>
            </div>
          </div>
          <div className="dashboard__card">
            <FaShoppingCart className="dashboard__card-icon" />
            <div className="dashboard__card-content">
              <h3>Purchases</h3>
              <p>Plan and track your purchase orders.</p>
            </div>
          </div>
          <div className="dashboard__card">
            <FaWarehouse className="dashboard__card-icon" />
            <div className="dashboard__card-content">
              <h3>Inventory</h3>
              <p>Keep an eye on your stock levels.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="dashboard__footer">
        <p>&copy; {new Date().getFullYear()} Inventory Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
