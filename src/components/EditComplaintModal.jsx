
import React, { useState, useEffect } from 'react'


function EditComplaintModal({ isOpen, onClose, onUpdate, initialData }) {
    const [referenceId, setReferenceId] = useState('')
    const [referenceType, setReferenceType] = useState('GoodsReceipt')
    const [reason, setReason] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [status, setStatus] = useState('Open')

    useEffect(() => {
        if (initialData) {
            setReferenceId(initialData.referenceId)
            setReferenceType(initialData.referenceType)
            setReason(initialData.reason)
            setQuantity(initialData.quantity)
            setStatus(initialData.status)
        }
    }, [initialData])

    if (!isOpen) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        onUpdate({ _id: initialData._id, referenceId, referenceType, reason, quantity, status })
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Reklamation bearbeiten</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Referenz ID:</label>
                        <input
                            type="text"
                            value={referenceId}
                            onChange={(e) => setReferenceId(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Referenztyp:</label>
                        <select
                            value={referenceType}
                            onChange={(e) => setReferenceType(e.target.value)}
                        >
                            <option value="GoodsReceipt">GoodsReceipt</option>
                            <option value="Sales">Sales</option>
                            <option value="PurchaseOrder">PurchaseOrder</option>
                        </select>
                    </div>
                    <div>
                        <label>Grund:</label>
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Menge:</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            min="1"
                            required
                        />
                    </div>
                    <div>
                        <label>Status:</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Open">Open</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button type="submit">Aktualisieren</button>
                        <button type="button" onClick={onClose}>Abbrechen</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditComplaintModal
