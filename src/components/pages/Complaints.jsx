import React, { useEffect, useState } from 'react'
import AddComplaintModal from '../AddComplaintModal'
import Pagination from '../Pagination'
import '../../styles/Table.css'
import '../../styles/Complaints.css'
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'

function Complaints() {
    const [complaints, setComplaints] = useState([])
    const [products, setProducts] = useState([])
    const [error, setError] = useState(null)
    const [isAddModalOpen, setAddModalOpen] = useState(false)
    const [isEditModalOpen, setEditModalOpen] = useState(false)
    const [selectedComplaint, setSelectedComplaint] = useState(null)
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
    const [deleteComplaintId, setDeleteComplaintId] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const complaintsPerPage = 5

    // Berechnung für Pagination
    const indexOfLastComplaint = currentPage * complaintsPerPage
    const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage
    const currentComplaints = complaints.slice(indexOfFirstComplaint, indexOfLastComplaint)

    useEffect(() => {
        async function fetchComplaints() {
            try {
                const response = await fetch('https://localhost:3001/api/complaint/all')
                if (!response.ok) {
                    throw new Error(`Failed to fetch complaints: ${response.status}`)
                }
                const data = await response.json()
                setComplaints(data)
            } catch (err) {
                setError(err.message)
            }
        }
        fetchComplaints()
    }, [])

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('https://localhost:3001/api/product/all')
                if (!response.ok) {
                    throw new Error(`Failed to fetch products: ${response.status}`)
                }
                const data = await response.json()
                setProducts(data)
            } catch (err) {
                setError(err.message)
            }
        }
        fetchProducts()
    }, [])

    const handleAddComplaint = async (newComplaint) => {
        console.log('Neue Beschwerde:', newComplaint)
        try {
            const response = await fetch('https://localhost:3001/api/complaint/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newComplaint)
            })
            if (!response.ok) throw new Error('Error beim Erstellen der Beschwerde')
            const data = await response.json()
            console.log('API-Antwort:', data)

            setComplaints((prev) => [...prev, data])
            setAddModalOpen(false)
        } catch (error) {
            console.error('Fehler beim Hinzufügen der Beschwerde:', error)
        }
    }

    const openDeleteModal = (complaintId) => {
        setDeleteComplaintId(complaintId)
        setDeleteModalOpen(true)
    }

    const referenceTypeMapping = {
        GoodsReceipt: 'Wareneingang',
        Sales: 'Verkauf'
    }

    const statusMapping = {
        Open: 'Offen',
        Resolved: 'Gelöst'
    }

    return (
        <div>
            <div className="complaints-header">
                <h1 className="complaints-title">Reklamationen</h1>
                <button className="add-complaint-button" onClick={() => setAddModalOpen(true)}>
                    Reklamation erstellen
                </button>
            </div>

            <AddComplaintModal
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                onAdd={handleAddComplaint}
                products={products}
            />

            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Referenztyp</th>
                            <th>Produkte</th>
                            <th>Status</th>
                            <th>Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentComplaints.map((complaint) => (
                            <tr key={complaint._id}>
                                <td>{referenceTypeMapping[complaint.referenceType] || complaint.referenceType}</td>
                                <td>
                                    {complaint.products.map((product, index) => (
                                        <div key={index}>
                                            <p>Name: {product.name}</p>
                                            <p>Menge: {product.quantity}</p>
                                            <p>Grund: {product.reason}</p>
                                        </div>
                                    ))}
                                </td>
                                <td>{statusMapping[complaint.status] || complaint.status}</td>
                                <td>
                                    <span className="actions">
                                        <BsFillPencilFill
                                            className="edit-btn"
                                            onClick={() => {
                                                setSelectedComplaint(complaint)
                                                setEditModalOpen(true)
                                            }}
                                        />
                                        <BsFillTrashFill
                                            className="delete-btn"
                                            onClick={() => openDeleteModal(complaint._id)}
                                        />
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                className="products-pagination"
                totalItems={complaints.length}
                itemsPerPage={complaintsPerPage}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    )
}

export default Complaints
