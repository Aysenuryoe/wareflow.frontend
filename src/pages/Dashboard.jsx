import React from "react";
import { FaBoxOpen, FaChartLine, FaShoppingCart, FaWarehouse } from "react-icons/fa";
import "../styles/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <header className="dashboard__header">
      <h1 className="dashboard__title">
  Welcome to the <em>wareflow</em> Dashboard
</h1>

        <p className="dashboard__subtitle">
          Streamline your inventory, sales, and purchase management effortlessly.
        </p>
      </header>

      <main className="dashboard__main">
        <section className="dashboard__cards">
          <div className="dashboard__card">
            <FaBoxOpen className="dashboard__card-icon" />
            <h3>Products</h3>
            <p>Manage and organize your product catalog efficiently.</p>
          </div>
          <div className="dashboard__card">
            <FaChartLine className="dashboard__card-icon" />
            <h3>Sales</h3>
            <p>Analyze sales trends and performance.</p>
          </div>
          <div className="dashboard__card">
            <FaShoppingCart className="dashboard__card-icon" />
            <h3>Purchases</h3>
            <p>Track and manage purchase orders seamlessly.</p>
          </div>
          <div className="dashboard__card">
            <FaWarehouse className="dashboard__card-icon" />
            <h3>Inventory</h3>
            <p>Monitor stock levels and optimize inventory management.</p>
          </div>
        </section>

        <section className="dashboard__overview">
          <h2>Quick Overview</h2>
          <div className="dashboard__overview-grid">
            <div className="dashboard__overview-item">
              <h3>500+</h3>
              <p>Total Products</p>
            </div>
            <div className="dashboard__overview-item">
              <h3>120</h3>
              <p>Sales This Month</p>
            </div>
            <div className="dashboard__overview-item">
              <h3>80</h3>
              <p>Pending Orders</p>
            </div>
            <div className="dashboard__overview-item">
              <h3>300</h3>
              <p>Items in Stock</p>
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
