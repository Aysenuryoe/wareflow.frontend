import React from "react";
import "../styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      <h1>wareflow</h1>
      <div className="search-container">
        <i className="fas fa-search search-icon"></i>
        <input type="text" placeholder="Suche..." className="search-input" />
      </div>
      <div className="mode-icons">
        <i className="fas fa-sun mode-icon" title="Light Mode"></i>
        <i className="fas fa-moon mode-icon" title="Dark Mode"></i>
      </div>
      <div className="user-profile">
        <i className="fas fa-user user-icon"></i>
      </div>
    </header>
  );
};

export default Header;
