
import React from "react";
import "../styles/Header.css";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <header className="header">
      <h1 className="header__title">wareflow</h1>

      <div className="header__user-profile">
        <Link to="/profile" >
        <i className="header__user-icon fas fa-user"></i>
        </Link>
      </div>
    </header>
  );
};

export default Header;
