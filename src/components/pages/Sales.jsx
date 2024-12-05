import React, { useState, useEffect } from 'react'

import DeleteModal from '../DeleteModal'
import SalesAddModal from '../SalesAddModal'

import '../../styles/Sales.css'

import { BsFillTrashFill } from 'react-icons/bs'

export default function Sales() {
    const [sales, setSales] = useState([])
    const [currentSale, setCurrentSale] = useState(null)
    const [isAddModalOpen, setAddModalOpen] = useState(false)
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)

    const fetchSales = async () => {
        try {
            const response = await fetch('https://localhost:3001/api/sales/all')
            if (response.ok) {
                const data = await response.json()
                setSales(data)
            }
        } catch (err) {
            console.error('Error fetching sales:', err)
        }
    }

    const handleAddSale = async (newSale) => {
        try {
            const response = await fetch('https://localhost:3001/api/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSale)
            })
            if (response.ok) {
                const savedSale = await response.json()
                setSales((prevSales) => [...prevSales, savedSale])
                setAddModalOpen(false)
            }
        } catch (err) {
            console.error('Error creating sale:', err)
        }
    }
    const handleDeleteSale = async () => {
        if (!currentSale) return

        try {
            const response = await fetch(`https://localhost:3001/api/sales/${currentSale.id}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                setSales((prevSales) => prevSales.filter((sale) => sale.id !== currentSale.id))
                setDeleteModalOpen(false)
                setCurrentSale(null)
            } else {
                console.error('Error deleting sale:', await response.text())
            }
        } catch (err) {
            console.error('Error deleting sale:', err)
        }
    }

    useEffect(() => {
        fetchSales()
    }, [])

    return (
        <div>
            <div className="sales-container">
                <div className="sales-card-header">
                    <h1 className="sales-title">Alle Verkäufe</h1>
                    <button className="add-sale-btn" onClick={() => setAddModalOpen(true)}>
                        Neuen Verkauf hinzufügen
                    </button>
                </div>
                <div className="sales-cards">
                    {sales.map((sale) => (
                        <div key={sale.id} className="sales-card">
                            <div className="sales-card-header">
                                <p>Verkauft am {new Date(sale.createdAt).toLocaleDateString()}</p>
                                <div className="sales-card-icons">
                                    <button
                                        className="icon-btn"
                                        onClick={() => {
                                            setCurrentSale(sale)
                                            setDeleteModalOpen(true)
                                        }}
                                    >
                                        <BsFillTrashFill />
                                    </button>
                                </div>
                            </div>
                            <div className="sales-card-body">
                                <div className="sales-card-products">
                                    {sale.products.map((product, index) => (
                                        <div key={index} className="product-card">
                                            <p>
                                                <strong>Produkte:</strong> {product.name}
                                            </p>
                                            <p>Preis: {product.price.toFixed(2)}€</p>
                                            <p>Menge: {product.quantity}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="sales-card-footer">
                                <p>
                                    <strong>Gesamtbetrag:</strong> {sale.totalAmount.toFixed(2)}€
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isAddModalOpen && <SalesAddModal closeModal={() => setAddModalOpen(false)} onSubmit={handleAddSale} />}

            {isDeleteModalOpen && (
                <DeleteModal
                    closeModal={() => setDeleteModalOpen(false)}
                    onConfirm={handleDeleteSale}
                    title="Verkauf löschen"
                    message={`Möchten Sie den Verkauf vom ${new Date(
                        currentSale.createdAt
                    ).toLocaleDateString()} wirklich löschen?`}
                    confirmText="Ja, löschen"
                    cancelText="Abbrechen"
                />
            )}
        </div>
    )
}
