import React from 'react';
import { IoBagHandle, IoPieChart, IoPeople, IoCart } from 'react-icons/io5';
import '../styles/StatsGrid.css';

export default function StatsGrid() {
	return (
		<div className="stats-grid">
			<BoxWrapper>
				<div className="icon-wrapper sky">
					<IoBagHandle className="icon" />
				</div>
				<div className="details">
					<span className="label">Total Sales</span>
					<div className="stats">
						<strong className="value">$54232</strong>
						<span className="change positive">+343</span>
					</div>
				</div>
			</BoxWrapper>
			<BoxWrapper>
				<div className="icon-wrapper orange">
					<IoPieChart className="icon" />
				</div>
				<div className="details">
					<span className="label">Total Expenses</span>
					<div className="stats">
						<strong className="value">$3423</strong>
						<span className="change positive">-343</span>
					</div>
				</div>
			</BoxWrapper>
			<BoxWrapper>
				<div className="icon-wrapper yellow">
					<IoPeople className="icon" />
				</div>
				<div className="details">
					<span className="label">Total Customers</span>
					<div className="stats">
						<strong className="value">12313</strong>
						<span className="change negative">-30</span>
					</div>
				</div>
			</BoxWrapper>
			<BoxWrapper>
				<div className="icon-wrapper green">
					<IoCart className="icon" />
				</div>
				<div className="details">
					<span className="label">Total Orders</span>
					<div className="stats">
						<strong className="value">16432</strong>
						<span className="change negative">-43</span>
					</div>
				</div>
			</BoxWrapper>
		</div>
	);
}

function BoxWrapper({ children }) {
	return <div className="box-wrapper">{children}</div>;
}
