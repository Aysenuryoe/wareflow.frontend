import React, { useState, useEffect } from 'react'
import Pagination from '../Pagination'
import '../../styles/Purchase.css'
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs'
import '../../styles/Table.css'
import PurchaseAddModal from '../PurchaseAddModal'
import PurchaseEditModal from '../PurchaseEditModal'

export default function PurchaseOrder() {
    const [purchaseOrders, setPurchaseOrders] = useState([])
    const [currentOrder, setCurrentOrder] = useState(null)
    const [isAddModalOpen, setAddModalOpen] = useState(false)
    const [isEditModalOpen, setEditModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const ordersPerPage = 7

    const indexOfLastOrder = currentPage * ordersPerPage
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
    const currentOrders = purchaseOrders.slice(indexOfFirstOrder, indexOfLastOrder)

    useEffect(() => {
        fetchPurchaseOrders()
    }, [])

    const fetchPurchaseOrders = async () => {
        setLoading(true)
        try {
            const response = await fetch('https://localhost:3001/api/purchase/all')
            const data = await response.json()
            setPurchaseOrders(data)
        } catch (error) {
            console.error('Fehler beim Abrufen der Daten:', error)
        } finally {
            setLoading(false)
        }
    }

    const deletePurchaseOrder = async (orderId) => {
        const response = await fetch(`https://localhost:3001/api/purchase/${orderId}`, {
            method: 'DELETE'
        })
        if (response.ok) {
            setPurchaseOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId))
            if (currentOrders.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1)
            }
        }
    }

    const postPurchaseOrder = async (newOrder) => {
        console.log(newOrder)
        const response = await fetch('https://localhost:3001/api/purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOrder)
        })

        if (response.ok) {
            const savedOrder = await response.json()
            setPurchaseOrders((prevOrders) => [...prevOrders, savedOrder])
            setAddModalOpen(false)
            setCurrentOrder(null)
        } else {
            console.error('Fehler beim Erstellen der Bestellung')
        }
    }

    const updatePurchaseOrder = async (updatedOrder) => {
        try {
            const response = await fetch(`https://localhost:3001/api/purchase/${updatedOrder.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedOrder),
            });
        
            if (!response.ok) {
                const errorDetails = await response.json(); // Fehlerdetails von der API
                console.error('Fehlerdetails:', errorDetails);
                throw new Error(`API-Fehler: ${response.status}`);
            }
        
            const savedOrder = await response.json();
            console.log('Erfolgreich aktualisiert:', savedOrder);
        
            setPurchaseOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === savedOrder._id ? savedOrder : order
                )
            );
            setEditModalOpen(false);
        } catch (error) {
            console.error('Fehler beim Aktualisieren der Bestellung:', error.message);
        }
        
    }

    const openAddOrderModal = () => {
        setCurrentOrder(null)
        setAddModalOpen(true)
    }

    const openEditOrderModal = (order) => {
        setCurrentOrder(order)
        setEditModalOpen(true)
    }

    return (
        <div className="purchase-order-container">
            <div className="purchase-header">
                <h1>Wareneinkäufe</h1>
                <button className="add-purchase-button " onClick={openAddOrderModal}>
                    Bestellung Hinzufügen
                </button>
            </div>

            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Produkte</th>
                            <th>Lieferant</th>
                            <th>Status</th>
                            <th>Bestelldatum</th>

                            <th>Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.map((order) => (
                            <tr key={order._id}>
                                <td>
                                    {order.products && order.products.length > 0 ? (
                                        <ul className="purchase-list">
                                            {order.products.map((product, index) => (
                                                <li key={index}>
                                                    Name: {product.productId}, Menge: {product.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span>Keine Produkte</span>
                                    )}
                                </td>
                                <td>{order.supplier}</td>
                                <td>{order.status}</td>
                                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td>
                                    <span className="actions">
                                        <BsFillPencilFill
                                            className="edit-btn"
                                            onClick={() => openEditOrderModal(order)}
                                        />
                                        <BsFillTrashFill
                                            className="delete-btn"
                                            onClick={() => deletePurchaseOrder(order._id)}
                                        />
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={currentPage}
                totalItems={purchaseOrders.length}
                itemsPerPage={ordersPerPage}
                onPageChange={setCurrentPage}
            />

            {isAddModalOpen && <PurchaseAddModal onClose={() => setAddModalOpen(false)} onSave={postPurchaseOrder} />}

            {isEditModalOpen && currentOrder && (
                <PurchaseEditModal
                    closeModal={() => setEditModalOpen(false)}
                    onSubmit={updatePurchaseOrder}
                    defaultValue={currentOrder}
                />
            )}
        </div>
    )
}
