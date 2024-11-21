// src/components/Header.jsx
import React from "react";
import "../styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      <h1 className="header__title">wareflow</h1>

      <div className="header__user-profile">
        <i className="header__user-icon fas fa-user"></i>
      </div>
    </header>
  );
};

export default Header;
