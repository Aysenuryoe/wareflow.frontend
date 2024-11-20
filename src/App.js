// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout'; 
import Dashboard from './pages/Dashboard';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Products from './pages/Product';
import Sales from './pages/Sales';
import Purchases from './pages/Purchase';
import Inventory from './pages/Inventory';

function App() {
    return (
        <Router>
            <Layout> 
                <Routes>
                    <Route path="/" element={<Dashboard />} /> 
                    <Route path="/products" element={<Products />} />
                    <Route path="/sales" element={<Sales />} /> 
                    <Route path="/purchases" element={<Purchases />} /> 
                    <Route path="/inventories" element={<Inventory />} /> 
                </Routes>
            </Layout>
        </Router>
    );
}


export default App;
