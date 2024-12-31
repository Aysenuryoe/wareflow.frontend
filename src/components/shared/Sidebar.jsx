import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FcBullish } from 'react-icons/fc'
import { HiOutlineLogout } from 'react-icons/hi'
import { DASHBOARD_SIDEBAR_LINKS } from '../../lib/Navigation'
import '../../styles/Sidebar.css'

export default function Sidebar() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('authToken')

        navigate('/login')
    }

    return (
        <div className="sidebar">
            <div className="logo">
                <FcBullish fontSize={24} />
                <span className="logo-text">wareflow</span>
            </div>
            <div className="links">
                {DASHBOARD_SIDEBAR_LINKS.map((link) => (
                    <SidebarLink key={link.key} link={link} />
                ))}
            </div>
            <div className="bottom-links">
                <div className="logout-link" onClick={handleLogout}>
                    <span className="icon">
                        <HiOutlineLogout />
                    </span>
                    Logout
                </div>
            </div>
        </div>
    )
}

function SidebarLink({ link }) {
    const { pathname } = useLocation()

    return (
        <Link to={link.path} className={`sidebar-link ${pathname === link.path ? 'active' : ''}`}>
            <span className="icon">{link.icon}</span>
            {link.label}
        </Link>
    )
}
