import React, { useState, useEffect } from "react";
import "../../styles/PurchaseAddModal.css";

function PurchaseAddModal({
  isOpen,
  onClose,
  onSubmit,
  title = "Create a new Purchase",
}) {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [orderDate, setOrderDate] = useState("");
  const [status, setStatus] = useState("ORDERED");
  const [errors, setErrors] = useState({});

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

    if (isOpen) {
      setSelectedProducts([{ barcode: "", quantity: 1 }]);
      setOrderDate("");
      setStatus("ORDERED");
      setErrors({});
    } else {
      setSelectedProducts([]);
      setOrderDate("");
      setStatus("ORDERED");
      setErrors({});
    }
  }, [isOpen]);

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

    if (errors.selectedProducts) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        selectedProducts: "",
      }));
    }
  };

  const handleQuantityChange = (e, index) => {
    const quantity = parseInt(e.target.value, 10);

    const updatedSelectedProducts = [...selectedProducts];
    updatedSelectedProducts[index] = {
      ...updatedSelectedProducts[index],
      quantity: isNaN(quantity) || quantity < 1 ? 1 : quantity,
    };
    setSelectedProducts(updatedSelectedProducts);
  };

  const handleProductRemove = (index) => {
    const updatedSelectedProducts = selectedProducts.filter(
      (_, i) => i !== index
    );
    setSelectedProducts(updatedSelectedProducts);

    if (updatedSelectedProducts.length === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        selectedProducts: "At least one product must be selected.",
      }));
    }

    if (errors.selectedProducts && updatedSelectedProducts.length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        selectedProducts: "",
      }));
    }
  };

  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, { barcode: "", quantity: 1 }]);

    if (errors.selectedProducts) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        selectedProducts: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!orderDate) {
      newErrors.orderDate = "Order Date is required.";
    } else {
      const date = new Date(orderDate);
      if (isNaN(date.getTime())) {
        newErrors.orderDate = "Order Date is invalid.";
      }
    }

    const hasAtLeastOneProduct = selectedProducts.some(
      (product) => product.barcode && product.barcode.trim() !== ""
    );

    if (!hasAtLeastOneProduct) {
      newErrors.selectedProducts = "At least one product must be selected.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const selectedProductDetails = selectedProducts
        .filter((product) => product.barcode)
        .map((selectedProduct) => ({
          barcode: selectedProduct.barcode,
          quantity: selectedProduct.quantity,
        }));

      const formattedOrderDate = new Date(orderDate).toISOString();

      const purchaseData = {
        products: selectedProductDetails,
        orderDate: formattedOrderDate,
        status,
      };

      await onSubmit(purchaseData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="purchase-add-modal__overlay">
      <div className="purchase-add-modal">
        <span className="purchase-add-modal__close" onClick={onClose}>
          &times;
        </span>
        <h2 className="purchase-add-modal__title">{title}</h2>
        <div className="purchase-add-modal__form-group">
          <div className="purchase-add-modal__form">
            <label className="purchase-add-modal__label" htmlFor="orderDate">
              Order Date:
            </label>
            <input
              type="date"
              id="orderDate"
              name="orderDate"
              value={orderDate}
              onChange={(e) => {
                setOrderDate(e.target.value);

                if (errors.orderDate) {
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    orderDate: "",
                  }));
                }
              }}
              className={`purchase-add-modal__input ${
                errors.orderDate ? "error" : ""
              }`}
            />

            {errors.orderDate && (
              <span className="purchase-add-modal__error">
                {errors.orderDate}
              </span>
            )}
          </div>

          <div className="purchase-add-modal__form">
            <label className="purchase-add-modal__label" htmlFor="status">
              Status:
            </label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="purchase-add-modal__select"
            >
              <option value="Ordered">Ordered</option>
  <option value="Pending">Pending</option>
  <option value="Arrived">Arrived</option>
  <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="purchase-add-modal__products-section">
            {selectedProducts.map((product, index) => (
              <div key={index} className="purchase-add-modal__product-group">
                <div className="purchase-add-modal__form-row">
                  <label
                    className="purchase-add-modal__label"
                    htmlFor={`product-${index}`}
                  >
                    Product:
                  </label>
                  <select
                    id={`product-${index}`}
                    name={`product-${index}`}
                    value={product.barcode}
                    onChange={(e) => handleProductSelect(e, index)}
                    className={`purchase-add-modal__select ${
                      errors.selectedProducts ? "error" : ""
                    }`}
                  >
                    <option value="">Select a product</option>
                    {products.map((prod) => (
                      <option key={prod.barcode} value={prod.barcode}>
                        {prod.article} - {prod.size} - (Price: {prod.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="purchase-add-modal__form-row">
                  <label
                    className="purchase-add-modal__label"
                    htmlFor={`quantity-${index}`}
                  >
                    Quantity:
                  </label>
                  <input
                    type="number"
                    id={`quantity-${index}`}
                    name={`quantity-${index}`}
                    min="1"
                    value={product.quantity}
                    onChange={(e) => handleQuantityChange(e, index)}
                    className="purchase-add-modal__input"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleProductRemove(index)}
                  className="purchase-add-modal__remove-button"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {errors.selectedProducts && (
            <span className="purchase-add-modal__error">
              {errors.selectedProducts}
            </span>
          )}

          <div className="purchase-add-modal__form">
            <button
              type="button"
              onClick={handleAddProduct}
              className="purchase-add-modal__add-product-btn"
            >
              Add Product
            </button>
          </div>
        </div>

        <div className="purchase-add-modal__actions">
          <button
            type="button"
            className="purchase-add-modal__button purchase-add-modal__button--cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="purchase-add-modal__button purchase-add-modal__button--create"
            onClick={handleSubmit}
          >
            Create Purchase
          </button>
        </div>
      </div>
    </div>
  );
}

export default PurchaseAddModal;
