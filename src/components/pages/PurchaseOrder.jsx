import React, { useState, useEffect } from 'react'
import Pagination from '../Pagination'
import '../../styles/Purchase.css'
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs'
import '../../styles/Table.css'
import PurchaseAddModal from '../PurchaseAddModal'
import PurchaseEditModal from '../PurchaseEditModal'
import DeleteModal from '../DeleteModal'

export default function PurchaseOrder() {
    const [purchaseOrders, setPurchaseOrders] = useState([])
    const [currentOrder, setCurrentOrder] = useState(null)
    const [isAddModalOpen, setAddModalOpen] = useState(false)
    const [isEditModalOpen, setEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
    const [orderToDelete, setOrderToDelete] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const ordersPerPage = 7

    const indexOfLastOrder = currentPage * ordersPerPage
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
    const currentOrders = purchaseOrders.slice(indexOfFirstOrder, indexOfLastOrder)

    useEffect(() => {
        fetchPurchaseOrders()
    }, [])

    const fetchPurchaseOrders = async () => {
        try {
            const response = await fetch('https://localhost:3001/api/purchase/all')
            const data = await response.json()
            setPurchaseOrders(data)
        } catch (error) {
            console.error('Fehler beim Abrufen der Daten:', error)
        }
    }
    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
    };

    const deletePurchaseOrder = async (orderId) => {
        try {
            const response = await fetch(`https://localhost:3001/api/purchase/${orderId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setPurchaseOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId))
                setDeleteModalOpen(false)
                setOrderToDelete(null)
            }
        } catch (error) {
            console.error('Fehler beim Löschen der Bestellung:', error)
        }
    }

    const openDeleteModal = (order) => {
        setOrderToDelete(order)
        setDeleteModalOpen(true)
    }

    return (
        <div className="purchase-order-container">
            <div className="purchase-header">
                <h1>Wareneinkäufe</h1>
                <button className="add-purchase-button" onClick={() => setAddModalOpen(true)}>
                    Bestellung Hinzufügen
                </button>
            </div>

            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nummer</th>
                            <th>Produkte</th>
                            <th>Lieferant</th>
                            <th>Status</th>
                            <th>Bestelldatum</th>
                            <th>Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.map((order, index) => (
                            <tr key={order._id}>
                                <td>{indexOfFirstOrder + index + 1}</td>
                                <td>
                                    {order.products?.length > 0 ? (
                                        <ul className="purchase-list">
                                            {order.products.map((product, idx) => (
                                                <li key={idx}>
                                                    {product.name}, Menge: {product.quantity}
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
                                            onClick={() => {
                                                setCurrentOrder(order)
                                                setEditModalOpen(true)
                                            }}
                                        />
                                        <BsFillTrashFill
                                            className="delete-btn"
                                            onClick={() => openDeleteModal(order)}
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

            {isAddModalOpen && (
                <PurchaseAddModal onClose={() => setAddModalOpen(false)} onSave={() => fetchPurchaseOrders()} />
            )}

            {isEditModalOpen && currentOrder && (
                <PurchaseEditModal
                    closeModal={() => setEditModalOpen(false)}
                    onSubmit={() => fetchPurchaseOrders()}
                    defaultValue={currentOrder}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    closeModal={closeDeleteModal}
                    onConfirm={deletePurchaseOrder}
                    title="Wareneinkauf löschen"
                    message="Möchten Sie diesen Wareneinkauf wirklich löschen?"
                    confirmText="Ja, löschen"
                    cancelText="Abbrechen"
                />
            )}
        </div>
    )
}
