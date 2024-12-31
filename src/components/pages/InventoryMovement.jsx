import React, { useEffect, useState } from 'react'
import '../../styles/Table.css'
import '../../styles/Inventory.css'

const InventoryMovement = () => {
    const [data, setData] = useState([])

    const [error, setError] = useState(null)
    const fetchData = async () => {
        try {
            const response = await fetch('https://localhost:3001/api/inventory/all')
            if (!response.ok) {
                throw new Error('Fehler beim Abrufen der Daten')
            }
            const result = await response.json()
            setData(result)
        } catch (error) {
            console.error('Fehler beim Abrufen der Daten:', error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (error) {
        return <p className="error">{error}</p>
    }

    return (
        <>
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
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>{new Date(item.date).toLocaleDateString()}</td>
                                    <td>{item.name}</td>
                                    <td>
                                        <span
                                            className={`type-badge ${
                                                item.type === 'Inbound'
                                                    ? 'type-inbound'
                                                    : item.type === 'Outbound'
                                                    ? 'type-outbound'
                                                    : item.type === 'Return'
                                                    ? 'type-return'
                                                    : item.type === 'Adjustment'
                                                    ? 'type-adjustment'
                                                    : 'type-default'
                                            }`}
                                        >
                                            {item.type === 'Inbound'
                                                ? 'Wareneingang'
                                                : item.type === 'Outbound'
                                                ? 'Warenausgang'
                                                : item.type === 'Return'
                                                ? 'Rückgabe'
                                                : item.type === 'Adjustment'
                                                ? 'Abschreibung'
                                                : item.type}
                                        </span>
                                    </td>

                                    <td>{item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default InventoryMovement
