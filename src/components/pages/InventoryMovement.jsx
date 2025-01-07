import React, { useEffect, useState } from 'react'
import '../../styles/Table.css'
import '../../styles/Inventory.css'
import Pagination from '../Pagination'

const InventoryMovement = () => {
    const [movements, setMovements] = useState([])
    const [products, setProducts] = useState([])
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 7 // Elemente pro Seite

    // Berechnung der Indizes für die Pagination
    const indexOfLastMovement = currentPage * itemsPerPage
    const indexOfFirstMovement = indexOfLastMovement - itemsPerPage

    // Bewegungen für die aktuelle Seite
    const currentMovements = movements.slice(indexOfFirstMovement, indexOfLastMovement)
    const totalPages = Math.ceil(movements.length / itemsPerPage) // Gesamtseitenanzahl

    useEffect(() => {
        const fetchMovements = async () => {
            try {
                const response = await fetch('https://localhost:3001/api/inventory/all')
                if (!response.ok) {
                    throw new Error('Fehler beim Abrufen der Bewegungen')
                }
                const result = await response.json()
                setMovements(result)
            } catch (err) {
                console.error('Fehler beim Abrufen der Bewegungen:', err)
                setError('Fehler beim Abrufen der Bewegungen')
            }
        }

        const fetchProducts = async () => {
            try {
                const response = await fetch('https://localhost:3001/api/product/all')
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
                const productsData = await response.json()
                setProducts(productsData)
            } catch (err) {
                console.error('Fehler beim Abrufen der Produkte:', err)
                setError('Fehler beim Abrufen der Produkte')
            }
        }

        fetchMovements()
        fetchProducts()
    }, [])

    if (error) {
        return <p className="error">{error}</p>
    }

    const typeLabelMap = {
        Inbound: 'Wareneingang',
        Outbound: 'Warenausgang',
        Return: 'Rückgabe',
        Adjustment: 'Abschreibung'
    }

    return (
        <div className="inventory-container">
            <div className="inventory-header">
                <h2 className="inventory-title">Bestandsbewegungen</h2>
            </div>
            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Datum</th>
                            <th>Artikel</th>
                            <th>Bewegungsart</th>
                            <th>Menge</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentMovements.map((move) => {
                            const matchingProduct = products.find((prod) => prod.id === move.productId)
                            const productName = matchingProduct ? matchingProduct.name : 'Unbekannt'
                            const productSize = matchingProduct ? matchingProduct.size : ''
                            const movementType = typeLabelMap[move.type] || move.type

                            const badgeClass = `type-badge ${
                                move.type === 'Inbound'
                                    ? 'type-inbound'
                                    : move.type === 'Outbound'
                                    ? 'type-outbound'
                                    : move.type === 'Return'
                                    ? 'type-return'
                                    : move.type === 'Adjustment'
                                    ? 'type-adjustment'
                                    : 'type-default'
                            }`

                            return (
                                <tr key={move.id}>
                                    <td>{new Date(move.date).toLocaleDateString()}</td>
                                    <td>
                                        {productName}
                                        {productSize && ` (Größe: ${productSize})`}
                                    </td>
                                    <td>
                                        <span className={badgeClass}>{movementType}</span>
                                    </td>
                                    <td>{move.quantity}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <Pagination
                className="inventory-pagination"
                totalItems={movements.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
            />
           
        </div>
    )
}

export default InventoryMovement
