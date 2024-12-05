import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';

export default function PurchaseAddModal({ onClose, onSave }) {
    const [products, setProducts] = useState([]);
    const [purchaseItems, setPurchaseItems] = useState([{ productId: '', quantity: 1 }]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch available products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://localhost:3001/api/product/all');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const productsData = await response.json();
                setProducts(productsData);
                setLoading(false);
            } catch (err) {
                setError('Failed to load products.');
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleProductChange = (index, field, value) => {
      const updatedItems = [...purchaseItems];
      
      if (field === 'productId') {
          const selectedProduct = products.find((p) => p.id === value); // Finde das Produkt aus der Liste
          updatedItems[index].productId = value;
          updatedItems[index].name = selectedProduct ? selectedProduct.name : ''; // Speichere den Namen
      } else {
          updatedItems[index][field] = value;
      }
      
      setPurchaseItems(updatedItems);
  };
  

    const addProduct = () => {
        setPurchaseItems([...purchaseItems, { productId: '', quantity: 1 }]);
    };

    const removeProduct = (index) => {
        setPurchaseItems(purchaseItems.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const supplier = e.target.supplier.value.trim();
        const status = e.target.status.value;
        const orderDate = e.target.orderDate.value;

        if (!supplier || !orderDate || purchaseItems.some(item => !item.productId || !item.quantity)) {
            alert('Bitte alle Felder ausfüllen.');
            return;
        }

        // Create the purchase data in the required structure
        const purchaseData = {
            supplier,
            status,
            orderDate,
            products: purchaseItems.map(({ productId, quantity }) => ({
                productId,
                quantity: parseInt(quantity, 10),
            })),
        };

        onSave(purchaseData);
    };

    return (
        <div className="modal-container">
            <div className="modal">
                <h2>Neue Bestellung hinzufügen</h2>
                {loading ? (
                    <p>Produkte werden geladen...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Lieferant:</label>
                            <input
                                type="text"
                                name="supplier"
                                className="form-control"
                                placeholder="Lieferant eingeben"
                            />
                        </div>
                        <div className="form-group">
                            <label>Status:</label>
                            <select name="status" className="form-control">
                                <option value="">Status auswählen</option>
                                <option value="Ordered">Ordered</option>
                                <option value="Pending">Pending</option>
                                <option value="Arrived">Arrived</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Bestelldatum:</label>
                            <input
                                type="date"
                                name="orderDate"
                                className="form-control"
                            />
                        </div>

                        {purchaseItems.map((item, index) => (
                            <div key={index} className="product-row">
                                <div className="form-group">
                                    <label>Produkt:</label>
                                    <select
                                        className="form-control"
                                        value={item.productId}
                                        onChange={(e) =>
                                            handleProductChange(index, 'productId', e.target.value)
                                        }
                                    >
                                        <option value="">Produkt auswählen</option>
                                        {products.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name} -- {product.size}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Menge:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={item.quantity}
                                        min="1"
                                        onChange={(e) =>
                                            handleProductChange(index, 'quantity', e.target.value)
                                        }
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeProduct(index)}
                                    className="remove-btn"
                                >
                                    Entfernen
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addProduct} className="add-product-btn">
                            Neues Produkt hinzufügen
                        </button>

                        <div className="modal-actions">
                            <button type="button" onClick={onClose} className="cancel-btn">
                                Abbrechen
                            </button>
                            <button type="submit" className="submit-btn">
                                Speichern
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
