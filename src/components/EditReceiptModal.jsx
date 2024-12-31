import React, { useState, useEffect } from 'react'
import '../styles/Modal.css'

function EditReceiptModal({ isOpen, onClose, onUpdate, initialData }) {
    const [formData, setFormData] = useState({
        purchaseOrderId: '',
        products: [],
        receivedDate: '',
        status: 'Pending',
        remarks: ''
    })

    useEffect(() => {
        if (initialData) {
            console.log('Initial Data:', initialData)
            setFormData({
                ...initialData,
                purchaseOrderId: initialData.purchaseOrderId || '',
                receivedDate: initialData.receivedDate || '',
                status: initialData.status || 'Pending',
                remarks: initialData.remarks || '',
                products: initialData.products || []
            })
        }
    }, [initialData])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleProductChange = (index, e) => {
        const { name, value } = e.target
        const updatedProducts = [...formData.products]
        updatedProducts[index][name] = name === 'receivedQuantity' ? parseInt(value, 10) : value
        setFormData({ ...formData, products: updatedProducts })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onUpdate(formData)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="modal-container">
            <div className="modal">
                <h2>Wareneingang bearbeiten</h2>
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <div className="input-row">
                                <label>Empfangsdatum:</label>
                                <input
                                    type="date"
                                    name="receivedDate"
                                    value={formData.receivedDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-row">
                                <label>Status:</label>
                                <select name="status" value={formData.status} onChange={handleInputChange}>
                                    <option value="Pending">Ausstehend</option>
                                    <option value="Completed">Abgeschlossen</option>
                                    <option value="Partial">Teilweise</option>
                                </select>
                            </div>
                        </div>

                        <h3>Produkte</h3>
                        {formData.products.map((product, index) => (
                            <div key={index} className="form-group">
                                <div className="input-row">
                                    <p>
                                        <strong>Produkt:</strong> {product.name}
                                    </p>

                                    <div>
                                        <label>Erhaltene Menge:</label>
                                        <input
                                            type="number"
                                            name="receivedQuantity"
                                            value={product.receivedQuantity}
                                            onChange={(e) => handleProductChange(index, e)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label>Differenzen:</label>
                                        <input
                                            type="text"
                                            name="discrepancies"
                                            value={product.discrepancies}
                                            onChange={(e) => handleProductChange(index, e)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="button-group">
                            <button type="button" className="cancel-btn" onClick={onClose}>
                                Abbrechen
                            </button>
                            <button type="submit" className="submit-btn">
                                Aktualisieren
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditReceiptModal
