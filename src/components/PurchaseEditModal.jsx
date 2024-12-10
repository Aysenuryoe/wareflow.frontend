import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';

function PurchaseEditModal ({ closeModal, onSubmit, defaultValue }){
    const [formData, setFormData] = useState({
        products: [],
        supplier: '',
        orderDate: '',
    });

    useEffect(() => {
        if (defaultValue) {
            setFormData({
                ...defaultValue,
                products: defaultValue.products || [],
                supplier: defaultValue.supplier || '',
                orderDate: defaultValue.orderDate
                    ? new Date(defaultValue.orderDate).toISOString().split('T')[0]
                    : '',
            });
        }
    }, [defaultValue]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleProductChange = (index, value) => {
        const updatedProducts = [...formData.products];
        updatedProducts[index].quantity = parseInt(value, 10);
        setFormData((prev) => ({ ...prev, products: updatedProducts }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedOrder = {
            ...formData,
            orderDate: new Date(formData.orderDate).toISOString(), 
        };
        onSubmit(updatedOrder);
        closeModal();
    };

    if (!defaultValue) return null; 

    return (
        <div className="modal-container">
            <div className="modal">
                <h2>Bestellung bearbeiten</h2>
                <form onSubmit={handleSubmit}>
                    <h3>Produkte</h3>
                    {formData.products.map((product, index) => (
                        <div key={index} className="product-group">
                            <div className="form-group">
                                <label>Produktname:</label>
                                <input
                                    type="text"
                                    value={product.name}
                                    readOnly
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Menge:</label>
                                <input
                                    type="number"
                                    value={product.quantity}
                                    min="1"
                                    onChange={(e) => handleProductChange(index, e.target.value)}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    ))}
    
                    <div className="form-group">
                        <label>Lieferant:</label>
                        <input
                            type="text"
                            name="supplier"
                            value={formData.supplier}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
    
                    <div className="form-group">
                        <label>Bestelldatum:</label>
                        <input
                            type="date"
                            name="orderDate"
                            value={formData.orderDate}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
    
                    <div className="button-group">
                        <button type="button" className="cancel-btn" onClick={closeModal}>
                            Abbrechen
                        </button>
                        <button type="submit" className="submit-btn">
                            Speichern
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
    
};

export default PurchaseEditModal;

