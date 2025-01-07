import React from 'react'

import Introduction from '../Introduction'
import '../../styles/Dashboard.css'

function Dashboard() {
    console.log('Dashboard rendered')
    return (
        <div className="dashboard">
            <Introduction />
        </div>
    )
}

export default Dashboard
