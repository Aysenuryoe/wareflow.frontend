import React, { useState, useEffect } from "react";
import "../../styles/SalesEditModal.css";

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
      setSelectedProducts(sale.products.map((product) => product.barcode));
    }
  }, [isOpen, sale]);

  const handleProductSelect = (e, index) => {
    const updatedSelectedProducts = [...selectedProducts];
    updatedSelectedProducts[index] = e.target.value;
    setSelectedProducts(updatedSelectedProducts);
  };

  const handleProductRemove = (index) => {
    const updatedSelectedProducts = selectedProducts.filter(
      (_, i) => i !== index
    );
    setSelectedProducts(updatedSelectedProducts);
  };

  const handleSubmit = async () => {
    if (!saleDate || selectedProducts.length === 0) {
      alert("Bitte alle Felder ausfüllen!");
      return;
    }

    const selectedProductDetails = selectedProducts
      .map((barcode) => {
        const product = sale.products.find((prod) => prod.barcode === barcode);
        return product ? { ...product, quantity: 1 } : null;
      })
      .filter(Boolean);

    const saleData = {
      saleDate,
      products: selectedProductDetails,
    };

    await onSubmit(saleData);
    onClose();
  };

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
            <div className="form">
              <label>Sale Date:</label>
              <input
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
              />
            </div>

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
                      {product.article} - {product.size} - (Price:{" "}
                      {product.price})
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

            <div className="form">
              <button
                type="button"
                onClick={handleAddProduct}
                className="add-product-btn"
              >
                Add Product
              </button>
            </div>

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
