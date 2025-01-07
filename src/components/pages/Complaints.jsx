import React, { useEffect, useState } from 'react'
import AddComplaintModal from '../AddComplaintModal'
import Pagination from '../Pagination'
import '../../styles/Table.css'
import '../../styles/Complaints.css'
import EditComplaintModal from '../EditComplaintModal'
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'
import DeleteModal from '../DeleteModal'

function Complaints() {
    const [complaints, setComplaints] = useState([])
    const [products, setProducts] = useState([])

    const [isAddModalOpen, setAddModalOpen] = useState(false)
    const [isEditModalOpen, setEditModalOpen] = useState(false)
    const [selectedComplaint, setSelectedComplaint] = useState(null)
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
    const [complaintToDelete, setComplaintToDelete] = useState(null)

    const [currentPage, setCurrentPage] = useState(1)
    const complaintsPerPage = 5
    const indexOfLastComplaint = currentPage * complaintsPerPage
    const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage
    const currentComplaints = complaints.slice(indexOfFirstComplaint, indexOfLastComplaint)

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await fetch('https://localhost:3001/api/complaint/all')
                if (!response.ok) {
                    throw new Error(`Failed to fetch complaints: ${response.status}`)
                }
                const data = await response.json()
                setComplaints(data)
            } catch (err) {
                console.error('Failed to load complaints:', err)
            }
        }
        fetchComplaints()
    }, [])

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://localhost:3001/api/product/all')
                if (!response.ok) {
                    throw new Error(`Failed to fetch products: ${response.status}`)
                }
                const data = await response.json()
                setProducts(data)
            } catch (err) {
                console.error('Failed to load products:', err)
            }
        }
        fetchProducts()
    }, [])

    const handleAddComplaint = async (newComplaint) => {
        try {
            const response = await fetch('https://localhost:3001/api/complaint/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newComplaint)
            })
            if (!response.ok) throw new Error('Fehler beim Erstellen der Beschwerde')
            const data = await response.json()
            setComplaints((prev) => [...prev, data])
            setAddModalOpen(false)
        } catch (error) {
            console.error('Fehler beim Hinzufügen der Beschwerde:', error)
        }
    }

    const editComplaint = async (updatedComplaint) => {
        try {
            const response = await fetch(`https://localhost:3001/api/complaint/${updatedComplaint.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedComplaint)
            })
            if (!response.ok) throw new Error('Fehler beim Aktualisieren der Beschwerde')

            const updatedData = await response.json()
            setComplaints((prevComplaints) =>
                prevComplaints.map((complaint) => (complaint.id === updatedComplaint.id ? updatedData : complaint))
            )
            setEditModalOpen(false)
        } catch (error) {
            console.error('Fehler beim Aktualisieren der Beschwerde:', error)
        }
    }

    const deleteComplaint = async (complaintId) => {
        try {
            const response = await fetch(`https://localhost:3001/api/complaint/${complaintId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setComplaints((prevComplaints) => prevComplaints.filter((complaint) => complaint.id !== complaintId))
                setDeleteModalOpen(false)
                setComplaintToDelete(null)
            }
        } catch (error) {
            console.error('Fehler beim Löschen der Reklamation:', error)
        }
    }

    const openDeleteModal = (complaint) => {
        setComplaintToDelete(complaint)
        setDeleteModalOpen(true)
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
        setComplaintToDelete(null)
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
        <div className="complaint-container">
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

            <EditComplaintModal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                onEdit={editComplaint}
                complaint={selectedComplaint}
                products={products}
            />

            {isDeleteModalOpen && complaintToDelete && (
                <DeleteModal
                    closeModal={closeDeleteModal}
                    onConfirm={() => deleteComplaint(complaintToDelete.id)}
                    title="Reklamation löschen"
                    message={`Möchten Sie die Reklamation wirklich löschen?`}
                    confirmText="Ja, löschen"
                    cancelText="Abbrechen"
                />
            )}

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
                            <tr key={complaint.id}>
                                <td>{referenceTypeMapping[complaint.referenceType] || complaint.referenceType}</td>
                                <td>
                                    {complaint.products.map((product, index) => (
                                        <div key={index}>
                                            <p>{product.name}</p>
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
                                            onClick={() => openDeleteModal(complaint)}
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
