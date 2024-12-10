import React, { useEffect, useState } from 'react'
import '../../styles/Table.css'
import "../../styles/Inventory.css"
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs'

const InventoryMovement = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [isAddModalOpen, setAddModalOpen] = useState(false) // Für das Hinzufügen von Bestandsbewegungen
    const [isEditModalOpen, setEditModalOpen] = useState(false) // Für das Bearbeiten von Bestandsbewegungen
    const [selectedMovement, setSelectedMovement] = useState(null) // Die Bestandsbewegung, die bearbeitet werden soll

    // Bestandsbewegungen laden
    const fetchData = async () => {
        try {
            const response = await fetch('https://localhost:3001/api/inventory/all')
            if (!response.ok) {
                throw new Error('Fehler beim Abrufen der Daten')
            }
            const result = await response.json()
            setData(result)
            setLoading(false)
        } catch (error) {
            console.error('Fehler beim Abrufen der Daten:', error)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    async function handleAddInventoryMovement(formData) {
        try {
            const response = await fetch('https://localhost:3001/api/inventory/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData) // Senden der Bestandsbewegung-Daten
            })

            if (!response.ok) {
                throw new Error('Fehler beim Hinzufügen der Bestandsbewegung')
            }

            const data = await response.json()
            console.log('Bestandsbewegung hinzugefügt:', data)
            // Nach dem Hinzufügen der Bestandsbewegung die Daten neu laden
            fetchData() // Hier muss die Daten neu geladen werden, z. B. über die fetchData()-Funktion
        } catch (err) {
            console.error('Fehler beim Hinzufügen der Bestandsbewegung:', err)
            alert(`Fehler: ${err.message}`)
        }
    }

    async function handleUpdateInventoryMovement(updatedData) {
        try {
            const response = await fetch(`https://localhost:3001/api/inventory/${updatedData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            })

            if (!response.ok) {
                throw new Error('Fehler beim Aktualisieren der Bestandsbewegung')
            }

            const data = await response.json()
            console.log('Bestandsbewegung aktualisiert:', data)
            fetchData()
        } catch (err) {
            console.error('Fehler beim Aktualisieren der Bestandsbewegung:', err)
            alert(`Fehler: ${err.message}`)
        }
    }

    const handleDeleteMovement = async (id) => {
        const confirmDelete = window.confirm('Möchten Sie diese Bestandsbewegung wirklich löschen?')
        if (!confirmDelete) return

        try {
            const response = await fetch(`https://localhost:3001/api/inventory/${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error(`Fehler beim Löschen der Bestandsbewegung`)
            }

            setData(data.filter((item) => item._id !== id))
        } catch (err) {
            console.error('Fehler beim Löschen der Bestandsbewegung:', err)
            alert(err.message)
        }
    }

    const handleEditMovement = (movement) => {
        setSelectedMovement(movement)
        setEditModalOpen(true)
    }

    return (
        <>
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
                            <th>Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item._id}>
                                <td>{new Date(item.date).toLocaleDateString()}</td>
                                <td>{item.productId?.name || 'Unbekannt'}</td>
                                <td>
                                    {item.type === 'Inbound'
                                        ? 'Wareneingang'
                                        : item.type === 'Outbound'
                                        ? 'Warenausgang'
                                        : item.type === 'Return'
                                        ? 'Rückgabe'
                                        : item.type === 'Adjustment'
                                        ? 'Abschreibung'
                                        : item.type}
                                </td>
                                <td>{item.quantity}</td>
                                <td>
                                    <span className="actions">
                                        <BsFillTrashFill
                                            className="delete-btn"
                                            onClick={() => handleDeleteMovement(item._id)}
                                        />

                                        <BsFillPencilFill
                                            className="edit-btn"
                                            onClick={() => handleEditMovement(item)}
                                        />
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default InventoryMovement
