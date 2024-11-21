import React, { useState, useEffect } from "react";
import "../../styles/PurchaseAddModal.css";

function PurchaseAddModal({
  isOpen,
  onClose,
  onSubmit,
  title = "Create a new Purchase",
}) {
  const [products, setProducts] = useState([]); // Verfügbare Produkte
  const [selectedProducts, setSelectedProducts] = useState([]); // Ausgewählte Produkte mit Mengen
  const [orderDate, setOrderDate] = useState(""); // Bestelldatum
  const [status, setStatus] = useState("ORDERED"); // Status (optional)

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

    // Fügen Sie ein leeres Produkt hinzu, wenn das Modal geöffnet wird
    if (isOpen) {
      setSelectedProducts([{ barcode: "", quantity: 1 }]);
    } else {
      setSelectedProducts([]);
    }
  }, [isOpen]);

  // Produkt auswählen
  const handleProductSelect = (e, index) => {
    const selectedBarcode = e.target.value;
    const product = products.find((p) => p.barcode === selectedBarcode);

    const updatedSelectedProducts = [...selectedProducts];
    updatedSelectedProducts[index] = {
      ...updatedSelectedProducts[index],
      barcode: selectedBarcode,
      article: product ? product.article : "",
      quantity: updatedSelectedProducts[index]?.quantity || 1,
    };
    setSelectedProducts(updatedSelectedProducts);
  };

  // Menge ändern
  const handleQuantityChange = (e, index) => {
    const quantity = parseInt(e.target.value, 10);

    const updatedSelectedProducts = [...selectedProducts];
    updatedSelectedProducts[index] = {
      ...updatedSelectedProducts[index],
      quantity: isNaN(quantity) ? 1 : quantity,
    };
    setSelectedProducts(updatedSelectedProducts);
  };

  // Produkt entfernen
  const handleProductRemove = (index) => {
    const updatedSelectedProducts = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updatedSelectedProducts);
  };


  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, { barcode: "", quantity: 1 }]);
  };


  const handleSubmit = async () => {

    const selectedProductDetails = selectedProducts.map((selectedProduct) => {
      return {
        barcode: selectedProduct.barcode,
        quantity: selectedProduct.quantity,
      };
    });
    const formattedOrderDate = new Date(orderDate).toISOString();


    const purchaseData = {
      products: selectedProductDetails,
      orderDate: formattedOrderDate,
      status,
    };

    await onSubmit(purchaseData);
    onClose();
  };

  return (
    isOpen && (
      <div className="purchase-add-modal-overlay">
        <div className="purchase-add-modal">
          <span className="close" onClick={onClose}>
            &times;
          </span>
          <h2>{title}</h2>
          <div className="form-group">
            <div className="form">
              <label>Order Date:</label>
              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
              />
            </div>

            <div className="form">
              <label>Status:</label>
              <select
  value={status}
  onChange={(e) => setStatus(e.target.value)}
>
  <option value="Ordered">Ordered</option>
  <option value="Pending">Pending</option>
  <option value="Arrived">Arrived</option>
  <option value="Cancelled">Cancelled</option>
</select>

            </div>

            {selectedProducts.map((product, index) => (
              <div key={index} className="product-group">
                <label>Product:</label>
                <select
                  value={product.barcode}
                  onChange={(e) => handleProductSelect(e, index)}
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.barcode} value={product.barcode}>
                      {product.article} - {product.size} - (Price: {product.price})
                    </option>
                  ))}
                </select>

                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  value={product.quantity}
                  onChange={(e) => handleQuantityChange(e, index)}
                />

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
              Create Purchase
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default PurchaseAddModal;
