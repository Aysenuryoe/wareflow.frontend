import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/shared/Layout'
import Dashboard from './components/pages/Dashboard'
import Products from './components/pages/Products'
import Sales from './components/pages/Sales'
import PurchaseOrder from './components/pages/PurchaseOrder'
import InventoryMovement from './components/pages/InventoryMovement'
import GoodsReceipt from './components/pages/GoodsReceipt'
import Return from './components/pages/Return'
import Complaints from './components/pages/Complaints'
import Login from './components/Login'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="sales" element={<Sales />} />
                    <Route path="purchase" element={<PurchaseOrder />} />
                    <Route path="inventory" element={<InventoryMovement />} />
                    <Route path="goodsreceipt" element={<GoodsReceipt />} />
                    <Route path="return" element={<Return />} />
                    <Route path="complaints" element={<Complaints />} />
                </Route>
                
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    )
}

export default App