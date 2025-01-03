import React, { useEffect, useState } from 'react'
import '../../styles/Table.css'
import '../../styles/Inventory.css'

const InventoryMovement = () => {
    const [movements, setMovements] = useState([]) // Umbenannt data => movements
    const [products, setProducts] = useState([]) // Alle Produkte
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchMovements()
        fetchProducts()
    }, [])

    const fetchMovements = async () => {
        try {
            const response = await fetch('https://localhost:3001/api/inventory/all')
            if (!response.ok) {
                throw new Error('Fehler beim Abrufen der Daten')
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

    if (error) {
        return <p className="error">{error}</p>
    }

    // Mapping für nicer Type-Anzeigenamen (optional)
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
                        {movements.map((move) => {
                            // Suche in products die passenden Produktinfos, z. B. Name, Größe, etc.
                            // Annahme: move.productId existiert
                            const matchingProduct = products.find((prod) => prod.id === move.productId)

                            // Produktname oder Fallback:
                            const productName = matchingProduct ? matchingProduct.name : 'Unbekannt'

                            // OPTIONAL: Größe
                            const productSize = matchingProduct ? matchingProduct.size : ''

                            // Bewegungsart als Badge
                            const movementType = typeLabelMap[move.type] || move.type
                            // CSS-Klasse für das Badge
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
        </div>
    )
}

export default InventoryMovement
