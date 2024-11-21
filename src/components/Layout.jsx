import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "../styles/Layout.css";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />

      <div className="layout__content">
        <Sidebar />
        <main className="layout__main-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
