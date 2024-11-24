import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../styles/SalesEditModal.css";


function SalesEditModal({ isOpen, onClose, onSubmit, item }) {
  const [formData, setFormData] = useState({
    saleDate: "",
    products: [],
  });
  const [errors, setErrors] = useState({});

  
  useEffect(() => {
    if (item) {
      setFormData({
        saleDate: item.saleDate ? item.saleDate.split("T")[0] : "",
        products: item.products || [],
      });
      setErrors({});
    }
  }, [item]);

  // Validierungslogik
  const validateForm = () => {
    const newErrors = {};

 
    if (!formData.saleDate) {
      newErrors.saleDate = "Sale date is required.";
    }

    formData.products.forEach((product, index) => {
      if (!product.quantity || product.quantity < 1) {
        newErrors[`products.${index}.quantity`] = "Quantity must be at least 1.";
      }
      if (!product.price || product.price < 1) {
        newErrors[`products.${index}.price`] = "Price must be at least 1.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Verarbeite Änderungen an den Produkten
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index][field] =
      field === "quantity" || field === "price" ? parseFloat(value) : value;

    setFormData({ ...formData, products: updatedProducts });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [`products.${index}.${field}`]: "",
    }));
  };

  // Verarbeite das Absenden des Formulars
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        ...formData,
        saleDate: `${formData.saleDate}T00:00:00.000Z`,
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
        <h2 className="modal__title">Edit Sale</h2>
        <form className="modal__form" onSubmit={handleSubmit}>
        
{/* Sale Date */}
<div className="modal__form-row">
  <label htmlFor="saleDate" className="modal__label">Sale Date:</label>
  <input
    type="date"
    id="saleDate"
    value={formData.saleDate}
    onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
    className={`modal__input ${errors.saleDate ? "error" : ""}`}
  />
  {errors.saleDate && <span className="modal__error">{errors.saleDate}</span>}
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
        onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
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

    {/* Price */}
    <div className="modal__form-row">
      <label htmlFor={`price-${index}`} className="modal__label">
        Price:
      </label>
      <input
        type="number"
        step="0.01"
        id={`price-${index}`}
        value={product.price || ""}
        onChange={(e) => handleProductChange(index, "price", e.target.value)}
        className={`modal__input ${
          errors[`products.${index}.price`] ? "error" : ""
        }`}
      />
      {errors[`products.${index}.price`] && (
        <span className="modal__error">
          {errors[`products.${index}.price`]}
        </span>
      )}
    </div>
  </div>
))}


          {/* Form Buttons */}
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

SalesEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  item: PropTypes.shape({
    saleDate: PropTypes.string.isRequired,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        barcode: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
      })
    ).isRequired,
  }),
};

export default SalesEditModal;
