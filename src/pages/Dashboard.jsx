import React from "react";
import "../styles/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h2 className="dashboard__title">
          Welcome to the Inventory Management System!
        </h2>
        <p className="dashboard__subtitle">
          This system helps you efficiently manage orders, sales, and inventory.
        </p>
      </header>

      <div className="dashboard__content">
        <p>
          Use the navigation bar on the left to explore the different modules of
          the system. Here you can:
        </p>
        <ul className="dashboard__list">
          <li className="dashboard__list-item">Add and manage products,</li>
          <li className="dashboard__list-item">Track and analyze sales,</li>
          <li className="dashboard__list-item">Plan and review purchases,</li>
          <li className="dashboard__list-item">
            And always keep an eye on your inventory levels.
          </li>
        </ul>
        <p>
          Get started by selecting a module or check out the latest features in
          the settings menu!
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
