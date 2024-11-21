import React from "react";
import "../styles/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Welcome to the Inventory Management System!</h2>
        <p className="dashboard-subtitle">
          This system helps you efficiently manage orders, sales, and inventory.
        </p>
      </header>

      <div className="dashboard-content">
        <p>
          Use the navigation bar on the left to explore the different modules of the system. Here you can:
        </p>
        <ul>
          <li>Add and manage products,</li>
          <li>Track and analyze sales,</li>
          <li>Plan and review purchases,</li>
          <li>And always keep an eye on your inventory levels.</li>
        </ul>
        <p>
          Get started by selecting a module or check out the latest features in the settings menu!
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
