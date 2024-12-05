import React from "react";
import StatsGrid from "../StatsGrid";
import TransactionChart from "../TransactionChart";
import Introduction from "../Introduction";
import "../../styles/Dashboard.css";

function Dashboard() {
    console.log("Dashboard rendered"); 
    return (
       
        <div className="dashboard">
            <Introduction />
            <StatsGrid />
            <div className="chart-container">
                <TransactionChart />
            </div>
        </div>
    );
}

export default Dashboard;
