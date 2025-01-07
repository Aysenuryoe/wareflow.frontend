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
    const [products, setProducts] = useState([])
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
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await fetch(`https://localhost:3001/api/product/all`)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            const data = await response.json()
            setProducts(data)
        } catch (err) {
            console.error('Fehler beim Abrufen der Produkte:', err)
        }
    }

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
        setDeleteModalOpen(false)
    }

    const createNewPurchase = async (purchaseData) => {
        try {
            console.log('Sende purchaseData:', purchaseData)

            const response = await fetch('https://localhost:3001/api/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(purchaseData)
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                const errorMessage = errorData.message || 'Fehler beim Erstellen des Einkaufs'
                throw new Error(errorMessage)
            }

            const responseData = await response.json()
            console.log('Erhaltene Antwort:', responseData)

            await fetchPurchaseOrders()
            setAddModalOpen(false)

            return { success: true, data: responseData }
        } catch (err) {
            console.error('Fehler beim Erstellen des Einkaufs:', err)
            return { success: false, message: err.message }
        }
    }

    const updatePurchaseOrder = async (updatedData) => {
        try {
            const response = await fetch(`https://localhost:3001/api/purchase/${updatedData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            })

            if (!response.ok) {
                console.error('Fehler beim Aktualisieren des Einkaufs')
                return { success: false, message: 'Fehler beim Aktualisieren des Einkaufs' }
            }

            console.log('Einkauf erfolgreich aktualisiert')
            fetchPurchaseOrders()
            setEditModalOpen(false)
            return { success: true }
        } catch (err) {
            console.error(err)
            return { success: false, message: err.message }
        }
    }

    const deletePurchaseOrder = async (orderId) => {
        try {
            const response = await fetch(`https://localhost:3001/api/purchase/${orderId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setPurchaseOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId))
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

    const statusMap = {
        Ordered: 'Bestellt',
        Arrived: 'Angekommen',
        Cancelled: 'Storniert'
    }

    const totalPages = Math.ceil(purchaseOrders.length / ordersPerPage) 

    return (
        <div className="purchase-order-container">
            <div className="purchase-header">
                <h1 className="purchase-order-title">Wareneinkäufe</h1>
                <button className="add-purchase-button" onClick={() => setAddModalOpen(true)}>
                    Wareneinkauf Hinzufügen
                </button>
            </div>

            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="row-number">Nummer</th>
                            <th>Produkte</th>
                            <th>Lieferant</th>
                            <th>Status</th>
                            <th>Bestelldatum</th>
                            <th>Empfangsdatum</th>
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
                                            {order.products.map((prodRef, idx) => {
                                                const matchingProduct = products.find((p) => p.id === prodRef.productId)
                                                const productName = matchingProduct ? matchingProduct.name : 'Unbekannt'

                                                return (
                                                    <li key={idx}>
                                                        {productName}, {prodRef.size}
                                                        <br />
                                                        Menge: {prodRef.quantity}
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    ) : (
                                        <span>Keine Produkte</span>
                                    )}
                                </td>
                                <td>{order.supplier}</td>
                                <td>{statusMap[order.status] || order.status}</td>
                                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td>{order.receivedDate ? new Date(order.receivedDate).toLocaleDateString() : '-'}</td>

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

            {isAddModalOpen && <PurchaseAddModal onClose={() => setAddModalOpen(false)} onSave={createNewPurchase} />}

            {isEditModalOpen && currentOrder && (
                <PurchaseEditModal
                    closeModal={() => setEditModalOpen(false)}
                    onSubmit={updatePurchaseOrder}
                    defaultValue={currentOrder}
                />
            )}

            {isDeleteModalOpen && orderToDelete && (
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    closeModal={closeDeleteModal}
                    onConfirm={() => deletePurchaseOrder(orderToDelete.id)}
                    title="Wareneinkauf löschen"
                    message="Möchten Sie diesen Wareneinkauf wirklich löschen?"
                    confirmText="Ja, löschen"
                    cancelText="Abbrechen"
                />
            )}
        </div>
    )
}
