import React, { useState, useEffect } from "react";
import "../../styles/SalesAddModal.css";

function SalesAddModal({
  isOpen,
  onClose,
  onSubmit,
  fetchProducts,
  title = "Create a new Sale",
}) {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [saleDate, setSaleDate] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`https://localhost:3001/api/product/all`);
        if (!response.ok) {
          throw new Error("Error loading products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    loadProducts();
  }, []);

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
    const selectedProductDetails = selectedProducts
      .map((barcode) => {
        const product = products.find((prod) => prod.barcode === barcode);
        return product ? { ...product, quantity: 1 } : null;
      })
      .filter(Boolean);

    const saleData = {
      products: selectedProductDetails,
      saleDate,
      source: "store",
    };

    await onSubmit(saleData);
    onClose();
  };

  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, ""]);
  };

  return (
    isOpen && (
      <div className="sales-add-modal-overlay">
        <div className="sales-add-modal">
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
                <label>Select:</label>
                <select
                  value={product}
                  onChange={(e) => handleProductSelect(e, index)}
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
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
          </div>

          <div className="modal-actions">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="create-btn" onClick={handleSubmit}>
              Create Sale
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default SalesAddModal;
