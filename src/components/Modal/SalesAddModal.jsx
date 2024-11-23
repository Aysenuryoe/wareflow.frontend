import React, { useState, useEffect } from "react";
import "../../styles/SalesAddModal.css";

function SalesAddModal({
  isOpen,
  onClose,
  onSubmit,
  title = "Create a new Sale",
}) {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [saleDate, setSaleDate] = useState("");
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
  }, []);

  const handleProductSelect = (e, index) => {
    const updatedSelectedProducts = [...selectedProducts];
    updatedSelectedProducts[index] = e.target.value;
    setSelectedProducts(updatedSelectedProducts);

    if (errors.selectedProducts) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        selectedProducts: "",
      }));
    }
  };

  const handleProductRemove = (index) => {
    const updatedSelectedProducts = selectedProducts.filter(
      (_, i) => i !== index
    );
    setSelectedProducts(updatedSelectedProducts);

    if (errors.selectedProducts) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        selectedProducts: "",
      }));
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const selectedProductDetails = selectedProducts
        .filter((barcode) => barcode)
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

      setSelectedProducts([]);
      setSaleDate("");
      setErrors({});
    }
  };

  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, ""]);

    if (errors.selectedProducts) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        selectedProducts: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!saleDate) {
      newErrors.saleDate = "Sale Date is required.";
    } else {
      const date = new Date(saleDate);
      if (isNaN(date.getTime())) {
        newErrors.saleDate = "Sale Date is invalid.";
      }
    }

    const hasAtLeastOneProduct = selectedProducts.some(
      (barcode) => barcode && barcode.trim() !== ""
    );

    if (!hasAtLeastOneProduct) {
      newErrors.selectedProducts = "At least one product must be selected.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  if (!isOpen) return null;

  return (
    <div className="sales-add-modal__overlay">
      <div className="sales-add-modal">
        <span className="sales-add-modal__close" onClick={onClose}>
          &times;
        </span>
        <h2 className="sales-add-modal__title">{title}</h2>
        <div className="sales-add-modal__form-group">
          <div className="sales-add-modal__form">
            <label className="sales-add-modal__label" htmlFor="saleDate">
              Sale Date:
            </label>
            <input
              type="date"
              id="saleDate"
              name="saleDate"
              value={saleDate}
              onChange={(e) => {
                setSaleDate(e.target.value);

                if (errors.saleDate) {
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    saleDate: "",
                  }));
                }
              }}
              className={`sales-add-modal__input ${
                errors.saleDate ? "error" : ""
              }`}
            />

            {errors.saleDate && (
              <span className="sales-add-modal__error">{errors.saleDate}</span>
            )}
          </div>

          {selectedProducts.map((product, index) => (
            <div key={index} className="sales-add-modal__product-group">
              <div className="sales-add-modal__form-row">
                <label
                  className="sales-add-modal__label"
                  htmlFor={`product-${index}`}
                >
                  Select:
                </label>
                <select
                  id={`product-${index}`}
                  name={`product-${index}`}
                  value={product}
                  onChange={(e) => handleProductSelect(e, index)}
                  className="sales-add-modal__select"
                >
                  <option value="">Select a product</option>
                  {products.map((prod) => (
                    <option key={prod.barcode} value={prod.barcode}>
                      {prod.article} - {prod.size} - (Price: {prod.price})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => handleProductRemove(index)}
                className="sales-add-modal__remove-button"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="sales-add-modal__form">
            <button
              type="button"
              onClick={handleAddProduct}
              className="sales-add-modal__add-product-btn"
            >
              Add Product
            </button>

            {errors.selectedProducts && (
              <span className="sales-add-modal__error">
                {errors.selectedProducts}
              </span>
            )}
          </div>
        </div>

        <div className="sales-add-modal__actions">
          <button
            type="button"
            className="sales-add-modal__button sales-add-modal__button--cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="sales-add-modal__button sales-add-modal__button--create"
            onClick={handleSubmit}
          >
            Create Sale
          </button>
        </div>
      </div>
    </div>
  );
}

export default SalesAddModal;
