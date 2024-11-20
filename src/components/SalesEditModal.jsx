import React, { useState, useEffect } from "react";
import "./SalesEditModal.css";

function SalesEditModal({
  isOpen,
  onClose,
  onSubmit,
  sale, 
  title = "Edit Sale",
}) {
  const [saleDate, setSaleDate] = useState(""); 
  const [selectedProducts, setSelectedProducts] = useState([]);

  
  useEffect(() => {
    if (isOpen && sale) {
      setSaleDate(sale.saleDate); 
      setSelectedProducts(sale.products.map(product => product.barcode));
    }
  }, [isOpen, sale]);

  // Produkt auswählen
  const handleProductSelect = (e, index) => {
    const updatedSelectedProducts = [...selectedProducts];
    updatedSelectedProducts[index] = e.target.value;
    setSelectedProducts(updatedSelectedProducts);
  };

  // Produkt entfernen
  const handleProductRemove = (index) => {
    const updatedSelectedProducts = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updatedSelectedProducts);
  };

  // Formular absenden (Verkauf bearbeiten)
  const handleSubmit = async () => {
    if (!saleDate || selectedProducts.length === 0) {
      alert("Bitte alle Felder ausfüllen!");
      return;
    }

    // Produktobjekte vorbereiten
    const selectedProductDetails = selectedProducts.map((barcode) => {
      const product = sale.products.find((prod) => prod.barcode === barcode);
      return product ? { ...product, quantity: 1 } : null; // Füge 'quantity' hinzu
    }).filter(Boolean); // Entfernt ungültige Produkte

    const saleData = {
      saleDate,
      products: selectedProductDetails,  // Die detaillierte Liste der Produkte
    };

    // Senden der Bearbeitungsdaten an die übergebene onSubmit-Funktion
    await onSubmit(saleData);
    onClose();  // Schließt das Modal
  };

  // Neuen Select hinzufügen
  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, ""]);
  };

  return (
    isOpen && (
      <div className="sales-edit-modal-overlay">
        <div className="sales-edit-modal">
          <span className="close" onClick={onClose}>
            &times;
          </span>
          <h2>{title}</h2>
          <div className="form-group">
            {/* Sale Date Eingabefeld */}
            <div className="form">
              <label>Sale Date:</label>
              <input
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
              />
            </div>

            {/* Dynamisch hinzuzufügende Produkt-Auswahlfelder */}
            {selectedProducts.map((product, index) => (
              <div key={index} className="product-group">
                <label>Select a product:</label>
                <select
                  value={product}
                  onChange={(e) => handleProductSelect(e, index)}
                >
                  <option value="">Select a product</option>
                  {sale.products.map((product) => (
                    <option key={product.barcode} value={product.barcode}>
                      {product.article} - {product.size} - (Price: {product.price})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleProductRemove(index)}
                  className="remove-product"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Add Product Button */}
            <div className="form">
              <button
                type="button"
                onClick={handleAddProduct}
                className="add-product-btn"
              >
                Add Product
              </button>
            </div>

            {/* Buttons für Cancel und Edit Sale */}
            <div className="modal-actions">
              <button className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button className="create-btn" onClick={handleSubmit}>
                Edit Sale
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default SalesEditModal;
