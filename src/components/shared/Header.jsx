import React from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import { FaUserCircle } from "react-icons/fa";
import '../../styles/Header.css';

function Header() {
    return (
        <div className="header">
            <div className="search-bar">
                <HiOutlineSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Suche..."
                    className="search-input"
                />
            </div>
            <div className="user-icon">
                <FaUserCircle />
            </div>
        </div>
    );
}

export default Header;
