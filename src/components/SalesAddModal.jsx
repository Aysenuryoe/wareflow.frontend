import React, { useState, useEffect } from "react";
import "./SalesAddModal.css";

function SalesAddModal({ isOpen, onClose, onSubmit }) {
  const [products, setProducts] = useState([]); 
  const [saleDate, setSaleDate] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`https://localhost:3001/api/product/all`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const addProduct = () => {
    setSelectedProducts((prev) => [
      ...prev,
      { barcode: "", quantity: 1, price: 0 },
    ]);
  };

  const updateProduct = (index, field, value) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index][field] = value;

    
    if (field === "barcode") {
      const selectedProduct = products.find((p) => p.barcode === value);
      if (selectedProduct) {
        updatedProducts[index].price = selectedProduct.price; 
      }
    }

    setSelectedProducts(updatedProducts);
  };

  const removeProduct = (index) => {
    setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const newSale = {
        saleDate: new Date(saleDate).toISOString().split("T")[0],
      products: selectedProducts.map(({ barcode, price, quantity }) => ({
        barcode,
        price,
        quantity: quantity || 1,
      })),
    };

    console.log("Submitting Sale:", newSale); 
    onSubmit(newSale);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="sales-add-modal-overlay">
      <div className="sales-add-modal">
        <h2>Create a new Sale</h2>
        <span className="close" onClick={onClose}>
          &times;
        </span>

        {/* Scrollbarer Formularinhalt */}
        <form
          className="form-control"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="form-group">
            <label>Sale Date:</label>
            <input
              type="date"
              value={saleDate}
              onChange={(e) => setSaleDate(e.target.value)}
              required
            />
          </div>

          {selectedProducts.map((product, index) => (
            <div key={index} className="product-group">
              <label>Select a product:</label>
              <select
                value={product.barcode}
                onChange={(e) =>
                  updateProduct(index, "barcode", e.target.value)
                }
                required
              >
                <option value="">Select</option>
                {products.map((p) => (
                  <option key={p.barcode} value={p.barcode}>
                    {p.article} (Size: {p.size})
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={product.quantity}
                onChange={(e) =>
                  updateProduct(index, "quantity", Number(e.target.value))
                }
                min="1"
                placeholder="Quantity"
              />
              <button
                type="button"
                className="remove-product"
                onClick={() => removeProduct(index)}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            className="add-product-btn"
            onClick={addProduct}
          >
            Add Product
          </button>

          {/* Fixierte Buttons */}
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="create-btn">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SalesAddModal;
