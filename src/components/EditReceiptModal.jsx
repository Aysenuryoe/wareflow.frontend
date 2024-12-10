import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';

function EditReceiptModal({ isOpen, onClose, onUpdate, initialData }) {
    const [formData, setFormData] = useState({
        purchaseOrderId: '',
        products: [],
        receivedDate: '',
        status: 'Pending',
        remarks: '',
    });

    useEffect(() => {
        if (initialData) {
            console.log("Initial Data:", initialData);  
            setFormData({
                ...initialData,
                purchaseOrderId: initialData.purchaseOrderId || '',
                receivedDate: initialData.receivedDate || '',
                status: initialData.status || 'Pending',
                remarks: initialData.remarks || '',
                products: initialData.products || [],
            });
        }
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleProductChange = (index, e) => {
        const { name, value } = e.target;
        const updatedProducts = [...formData.products];
        updatedProducts[index][name] = name === 'receivedQuantity' ? parseInt(value, 10) : value;
        setFormData({ ...formData, products: updatedProducts });
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(formData);  
        onClose();  
    };

    if (!isOpen) return null;

    return (
        <div className="modal-container">
            <div className="modal">
                <h2>Wareneingang bearbeiten</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Purchase Order:</label>
                        <input
                            type="text"
                            name="purchaseOrderId"
                            value={formData.purchaseOrderId}
                            disabled
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label>Received Date:</label>
                        <input
                            type="date"
                            name="receivedDate"
                            value={formData.receivedDate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Status:</label>
                        <select name="status" value={formData.status} onChange={handleInputChange}>
                            <option value="Pending">Ausstehend</option>
                            <option value="Completed">Abgeschlossen</option>
                            <option value="Partial">Teilweise</option>
                        </select>
                    </div>

                    <h3>Products</h3>
                    {formData.products.map((product, index) => (
                        <div key={index} className="form-group">
                            {/* Produktname anzeigen */}
                            <p>
                                <strong>Produkt:</strong> {product.name}
                            </p>

                            {/* Bestellte Menge anzeigen */}
                            <p>
                                <strong>Bestellte Menge:</strong> {product.orderedQuantity || 'N/A'}
                            </p>

                            {/* Erhaltene Menge bearbeiten */}
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

                            {/* Differenzen bearbeiten */}
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
    );
}

export default EditReceiptModal;
