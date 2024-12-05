import React, { useState, useEffect } from 'react';
import "../styles/Modal.css";

const PurchaseEditModal = ({ closeModal, onSubmit, defaultValue }) => {
    const [purchase, setPurchase] = useState({
        products: [],
        supplier: '',
        status: 'Pending',
        orderDate: '',
        receivedDate: '',
     
    });

    useEffect(() => {
        if (defaultValue) {
            setPurchase({
                ...defaultValue,
                orderDate: defaultValue.orderDate
                    ? new Date(defaultValue.orderDate).toISOString().split('T')[0]
                    : '',
                receivedDate: defaultValue.receivedDate
                    ? new Date(defaultValue.receivedDate).toISOString().split('T')[0]
                    : '',
            });
        }
    }, [defaultValue]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPurchase((prev) => ({ ...prev, [name]: value }));
    };

    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...purchase.products];
        updatedProducts[index] = { ...updatedProducts[index], [field]: value };
        setPurchase((prev) => ({ ...prev, products: updatedProducts }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Daten formatieren
        const sanitizedOrder = {
            products: purchase.products.map((p) => ({
                productId: p.productId,
                quantity: parseInt(p.quantity, 10),
            })),
            supplier: purchase.supplier.trim(),
            status: purchase.status,
            orderDate: new Date(purchase.orderDate).toISOString(),
        };
    
        // Nur `receivedDate` hinzufügen, wenn es gesetzt ist
        if (purchase.receivedDate) {
            sanitizedOrder.receivedDate = new Date(purchase.receivedDate).toISOString();
        }
    
        console.log('Gesendete Daten:', sanitizedOrder);
    
        // Daten an die übergebene `onSubmit`-Funktion weitergeben
        onSubmit(sanitizedOrder);
    };
    

    return (
        <div className="modal-container">
            <div className="modal">
                <h2>Bestellung bearbeiten</h2>
                <form onSubmit={handleSubmit}>
                {purchase.products.map((product, index) => (
                        <div key={index} className="product-row">
                            <div className="form-group">
                                <label>Produkt:</label>
                                <input
                                    type="text"
                                    value={product.productId}
                                    onChange={(e) =>
                                        handleProductChange(index, 'productId', e.target.value)
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>Menge:</label>
                                <input
                                    type="number"
                                    value={product.quantity}
                                    onChange={(e) =>
                                        handleProductChange(index, 'quantity', e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    ))}
                    <div className="form-group">
                        <label>Lieferant:</label>
                        <input
                            type="text"
                            name="supplier"
                            value={purchase.supplier}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Status:</label>
                        <select
                            name="status"
                            value={purchase.status}
                            onChange={handleChange}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Ordered">Ordered</option>
                            <option value="Arrived">Arrived</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Bestelldatum:</label>
                        <input
                            type="date"
                            name="orderDate"
                            value={purchase.orderDate}
                            onChange={handleChange}
                        />
                    </div>
            


                    <div className="button-group">
                        <button type="button" className='cancel-btn' onClick={closeModal}>
                            Abbrechen
                        </button>
                        <button type="submit" className='submit-btn'>Speichern</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PurchaseEditModal;
