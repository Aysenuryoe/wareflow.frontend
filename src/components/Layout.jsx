// src/components/Layout.jsx
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "../styles/Layout.css"; // Stile für das Layout

const Layout = ({ children }) => {
    return (
        <div className="layout">
            {/* Header oben */}
            <Header />

            {/* Sidebar links und Hauptinhalt */}
            <div className="layout-content">
                <Sidebar />
                <main className="main-content">{children}</main> {/* Dynamischer Seiteninhalt */}
            </div>
        </div>
    );
};

export default Layout;
