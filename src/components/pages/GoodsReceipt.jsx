import React, { useEffect, useState } from 'react'
import AddReceiptModal from '../AddReceiptModal'
import '../../styles/Table.css'
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'
import '../../styles/GoodsReceipt.css'
import EditReceiptModal from '../EditReceiptModal'
import DeleteModal from '../DeleteModal'
import Pagination from '../Pagination' // Import der Pagination-Komponente

function GoodsReceipt() {
    const [goodsReceipts, setGoodsReceipts] = useState([])
    const [error, setError] = useState(null)
    const [isModalOpen, setModalOpen] = useState(false)
    const [isEditModalOpen, setEditModalOpen] = useState(false)
    const [selectedReceipt, setSelectedReceipt] = useState(null)
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
    const [deleteReceiptId, setDeleteReceiptId] = useState(null)

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 7 // Anzahl der Einträge pro Seite

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                const response = await fetch('https://localhost:3001/api/goodsreceipt/all')
                if (!response.ok) {
                    throw new Error(`Failed to fetch goods receipts: ${response.status}`)
                }
                const data = await response.json()
                setGoodsReceipts(data)
            } catch (err) {
                setError(err.message)
                console.error('Failed to fetch goods receipts:', err)
            }
        }
        fetchReceipts()
    }, [])

    async function handleAddGoodsReceipt(newReceipt) {
        try {
            const response = await fetch('https://localhost:3001/api/goodsreceipt/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newReceipt)
            })
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }
            const data = await response.json()
            setGoodsReceipts((prev) => [...prev, data])
        } catch (err) {
            console.error('Failed to add goods receipt:', err)
            alert(`Error: ${err.message}`)
        }
    }

    async function handleUpdateGoodsReceipt(updatedReceipt) {
        console.log('Updated Receipt:', updatedReceipt)
        try {
            const response = await fetch(`https://localhost:3001/api/goodsreceipt/${updatedReceipt.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedReceipt)
            })
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }
            const data = await response.json()
            setGoodsReceipts((prev) => prev.map((receipt) => (receipt.id === updatedReceipt.id ? data : receipt)))
            setEditModalOpen(false)
            setSelectedReceipt(null)
        } catch (err) {
            console.error('Failed to update goods receipt:', err)
            alert(`Error: ${err.message}`)
        }
    }

    const openDeleteModal = (receiptId) => {
        setDeleteReceiptId(receiptId)
        setDeleteModalOpen(true)
    }

    const handleDeleteGoodsReceiptConfirm = async () => {
        if (!deleteReceiptId) return
        try {
            const response = await fetch(`https://localhost:3001/api/goodsreceipt/${deleteReceiptId}`, {
                method: 'DELETE'
            })
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }
            setGoodsReceipts((prev) => prev.filter((r) => r.id !== deleteReceiptId))
            setDeleteModalOpen(false)
            setDeleteReceiptId(null)
        } catch (err) {
            console.error('Failed to delete goods receipt:', err)
            alert(`Error: ${err.message}`)
        }
    }

    const statusMap = {
        Pending: 'Ausstehend',
        Completed: 'Abgeschlossen',
        Partial: 'Teilweise'
    }

    // Berechnung der aktuellen Seite
    const indexOfLastReceipt = currentPage * itemsPerPage
    const indexOfFirstReceipt = indexOfLastReceipt - itemsPerPage
    const currentReceipts = goodsReceipts.slice(indexOfFirstReceipt, indexOfLastReceipt)
    const totalPages = Math.ceil(goodsReceipts.length / itemsPerPage)

    return (
        <div className="goods-container">
            <div className="goods-header">
                <h1 className="goods-title">Wareneingang</h1>
                <button className="add-receipt-button" onClick={() => setModalOpen(true)}>
                    Wareneingang hinzufügen
                </button>
            </div>

            <AddReceiptModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onAdd={handleAddGoodsReceipt} />

            {isEditModalOpen && selectedReceipt && (
                <EditReceiptModal
                    isOpen={isEditModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    onUpdate={handleUpdateGoodsReceipt}
                    initialData={selectedReceipt}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteModal
                    closeModal={() => setDeleteModalOpen(false)}
                    onConfirm={handleDeleteGoodsReceiptConfirm}
                    title="Wareneingang löschen"
                    message="Möchten Sie diesen Wareneingang wirklich löschen?"
                    confirmText="Ja, löschen"
                    cancelText="Abbrechen"
                />
            )}

            <div className="table-wrapper">
                {error && <p className="error">{error}</p>}
                <table className="table">
                    <thead>
                        <tr>
                            <th>Produkte</th>
                            <th>Empfangsdatum</th>
                            <th>Status</th>
                            <th>Bemerkungen</th>
                            <th>Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentReceipts.map((receipt) => (
                            <tr key={receipt.id}>
                                <td>
                                    {receipt.products?.length > 0 ? (
                                        <ul className="goods-list">
                                            {receipt.products.map((product, index) => (
                                                <li key={index}>
                                                    {product.name}, {product.size} - Menge: {product.receivedQuantity}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span>Keine Produkte</span>
                                    )}
                                </td>
                                <td>{new Date(receipt.receivedDate).toLocaleDateString()}</td>
                                <td>{statusMap[receipt.status] || receipt.status}</td>
                                <td>{receipt.remarks || 'Keine Bemerkung'}</td>
                                <td>
                                    <span className="actions">
                                        <BsFillPencilFill
                                            className="edit-btn"
                                            onClick={() => {
                                                setSelectedReceipt(receipt)
                                                setEditModalOpen(true)
                                            }}
                                        />
                                        <BsFillTrashFill
                                            className="delete-btn"
                                            onClick={() => openDeleteModal(receipt.id)}
                                        />
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                totalItems={goodsReceipts.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
            />
         
        </div>
    )
}

export default GoodsReceipt
