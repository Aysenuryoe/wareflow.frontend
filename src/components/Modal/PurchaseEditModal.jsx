import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../styles/PurchaseEditModal.css";

function PurchaseEditModal({ isOpen, onClose, onSubmit, item }) {
  const [formData, setFormData] = useState({
    orderDate: "",
    status: "",
    products: [],
  });
  const [errors, setErrors] = useState({});

  const statusOptions = ["Ordered", "Pending", "Arrived", "Cancelled"];

  useEffect(() => {
    if (item) {
      setFormData({
        orderDate: item.orderDate ? item.orderDate.split("T")[0] : "",
        status: item.status || "",
        products: item.products || [],
      });
      setErrors({});
    }
  }, [item]);

  const validateForm = () => {
    const newErrors = {};

    // Validate Order Date
    if (!formData.orderDate) {
      newErrors.orderDate = "Order date is required.";
    }

    // Validate Status
    if (!formData.status) {
      newErrors.status = "Status is required.";
    }

    // Validate Quantity for each product
    formData.products.forEach((product, index) => {
      if (!product.quantity || product.quantity < 1) {
        newErrors[`products.${index}.quantity`] = "Quantity must be at least 1.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index][field] = parseInt(value, 10);

    setFormData({ ...formData, products: updatedProducts });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [`products.${index}.${field}`]: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        orderDate: `${formData.orderDate}T00:00:00.000Z`,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal__content">
        <span className="modal__close" onClick={onClose}>
          &times;
        </span>
        <h2 className="modal__title">Edit Purchase</h2>
        <form className="modal__form" onSubmit={handleSubmit}>
          {/* Order Date */}
          <div className="modal__form-row">
            <label htmlFor="orderDate" className="modal__label">Order Date:</label>
            <input
              type="date"
              id="orderDate"
              value={formData.orderDate}
              onChange={(e) =>
                setFormData({ ...formData, orderDate: e.target.value })
              }
              className={`modal__input ${errors.orderDate ? "error" : ""}`}
            />
            {errors.orderDate && <span className="modal__error">{errors.orderDate}</span>}
          </div>

          {/* Status */}
          <div className="modal__form-row">
            <label htmlFor="status" className="modal__label">Status:</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className={`modal__input ${errors.status ? "error" : ""}`}
            >
              <option value="">Select Status</option>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.status && <span className="modal__error">{errors.status}</span>}
          </div>

          {/* Products */}
          <h3 className="modal__section-title">Products</h3>
          {formData.products.map((product, index) => (
            <div key={index} className="modal__product-group">
              {/* Barcode (read-only) */}
              <div className="modal__form-row">
                <label htmlFor={`barcode-${index}`} className="modal__label">
                  Barcode:
                </label>
                <input
                  type="text"
                  id={`barcode-${index}`}
                  value={product.barcode || ""}
                  readOnly
                  className="modal__input modal__input--readonly"
                />
              </div>

              {/* Quantity */}
              <div className="modal__form-row">
                <label htmlFor={`quantity-${index}`} className="modal__label">
                  Quantity:
                </label>
                <input
                  type="number"
                  id={`quantity-${index}`}
                  value={product.quantity || ""}
                  onChange={(e) =>
                    handleProductChange(index, "quantity", e.target.value)
                  }
                  className={`modal__input ${
                    errors[`products.${index}.quantity`] ? "error" : ""
                  }`}
                />
                {errors[`products.${index}.quantity`] && (
                  <span className="modal__error">
                    {errors[`products.${index}.quantity`]}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Buttons */}
          <div className="modal__button-group">
            <button
              type="button"
              className="modal__button modal__button--cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal__button modal__button--submit"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

PurchaseEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  item: PropTypes.shape({
    orderDate: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["Ordered", "Pending", "Arrived", "Cancelled"]),
    products: PropTypes.arrayOf(
      PropTypes.shape({
        barcode: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
      })
    ).isRequired,
  }),
};

export default PurchaseEditModal;
