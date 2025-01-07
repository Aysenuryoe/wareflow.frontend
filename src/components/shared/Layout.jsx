import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import '../../styles/Layout.css'

export default function Layout() {
    return (
        <div className="layout">
            <Sidebar />
            <div className="main">
                <Outlet />
            </div>
        </div>
    )
}
