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
    const [products, setProducts] = useState([])

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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://localhost:3001/api/product/all')
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
                const productsData = await response.json()
                setProducts(productsData)
            } catch (err) {
                console.error('Failed to load products:', err)
            }
        }
        fetchProducts()
    }, [])

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
                return true
            } else {
                const errorText = await response.text()
                console.error('Error creating sale:', errorText)
                return false
            }
        } catch (err) {
            console.error('Error creating sale:', err)
            return false
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
                <div className="sales-header">
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
                            <strong>Produkte:</strong>

                            <div className="sales-card-body">
                                <div className="sales-card-products">
                                    {sale.products.map((saleProduct, index) => {
                                        const matchingProduct = products.find((p) => p.id === saleProduct.productId)

                                        const productName = matchingProduct
                                            ? matchingProduct.name
                                            : saleProduct.name || 'Unbekannt'
                                        const productSize = matchingProduct ? matchingProduct.size : 'n/A'

                                        return (
                                            <div key={index} className="product-card">
                                                <p>
                                                    Name: {productName} {productSize && `(Größe: ${productSize})`}
                                                </p>
                                                <p>Preis: {saleProduct.price.toFixed(2)}€</p>
                                                <p>Menge: {saleProduct.quantity}</p>
                                            </div>
                                        )
                                    })}
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
