import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/shared/Layout';
import Dashboard from './components/pages/Dashboard';
import Products from './components/pages/Products';
import Sales from './components/pages/Sales';
import PurchaseOrder from './components/pages/PurchaseOrder';
import InventoryMovement from './components/pages/InventoryMovement';
import GoodsReceipt from './components/pages/GoodsReceipt';
import Return from './components/pages/Return';
import Complaints from './components/pages/Complaints';
import Login from './components/Login';
import { useState } from 'react';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
                >
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="sales" element={<Sales />} />
                    <Route path="purchase" element={<PurchaseOrder />} />
                    <Route path="inventory" element={<InventoryMovement />} />
                    <Route path="goodsreceipt" element={<GoodsReceipt />} />
                    <Route path="return" element={<Return />} />
                    <Route path="complaints" element={<Complaints />} />
                </Route>
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/" />
                        ) : (
                            <Login onLogin={() => setIsAuthenticated(true)} />
                        )
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
