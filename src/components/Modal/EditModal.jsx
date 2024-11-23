import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function EditModal({
  isOpen,
  onClose,
  onSubmit,
  fields = [],
  title = "Edit Item",
  item,
}) {
  const [formData, setFormData] = useState({});
  const [dynamicFields, setDynamicFields] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      const updatedItem = { ...item };
      if (item.orderDate || item.saleDate) {
        const dateField = item.orderDate ? "orderDate" : "saleDate";
        updatedItem[dateField] = item[dateField].split("T")[0];
      }
      setFormData(updatedItem);
      setErrors({});

      if (!fields || fields.length === 0) {
        const generatedFields = Object.keys(updatedItem)
          .filter((key) => key !== "id" && key !== "products")
          .map((key) => {
            return {
              name: key,
              label: key.charAt(0).toUpperCase() + key.slice(1),
              type:
                typeof updatedItem[key] === "number"
                  ? "number"
                  : key.toLowerCase().includes("date")
                  ? "date"
                  : "text",
              required: true,
            };
          });
        setDynamicFields(generatedFields);
      }
    }
  }, [item, fields]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Feld geändert: ${name} = ${value}`);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleProductQuantityChange = (index, field, value) => {
    setFormData((prevData) => {
      const updatedProducts = prevData.products ? [...prevData.products] : [];
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]:
          field === "quantity" || field === "price"
            ? parseFloat(value)
            : value,
      };
      return {
        ...prevData,
        products: updatedProducts,
      };
    });
  };

  const prepareFormDataForSubmit = (data) => {
    const preparedData = { ...data };
    if (preparedData.orderDate || preparedData.saleDate) {
      const dateField = preparedData.orderDate
        ? "orderDate"
        : "saleDate";
      preparedData[dateField] = `${preparedData[dateField]}T00:00:00.000Z`;
    }
    return preparedData;
  };

  const validateField = (field, value) => {
    console.log(`Validierung für Feld: ${field.name} mit Wert: ${value}`);
    switch (field.name) {
      case "article":
        if (typeof value === "string") {
          if (!value.trim()) {
            return "Article is required.";
          }
          if (!/^[A-Za-z\s]+$/.test(value)) {
            return "Article can only contain letters and spaces.";
          }
        } else {
          return "Article must be a valid text.";
        }
      case "size":
        if (!value) {
          return "Size must be selected.";
        }
        if (
          field.options &&
          !field.options.map((opt) => opt.value).includes(value)
        ) {
          return "Invalid size selected.";
        }
        break;
      case "barcode":
        if (typeof value === "string") {
          if (!value.trim()) {
            return "Barcode is required.";
          }
          if (!/^\d+$/.test(value)) {
            return "Barcode can only contain numbers.";
          }
          if (value.length !== 6) {
            return "Barcode must be exactly 6 digits long.";
          }
        } else {
          return "Barcode must be a valid text.";
        }
        break;
      case "price":
        if (value === "" || value === null || value === undefined) {
          return "Price is required.";
        }
        if (isNaN(value)) {
          return "Price can only contain numbers.";
        }
        if (Number(value) < 1) {
          return "Price must be at least 1.";
        }
        break;
      case "productNum":
        if (typeof value === "string") {
          if (!value.trim()) {
            return "Product Number is required.";
          }
          if (!/^\d+$/.test(value)) {
            return "Product Number can only contain numbers.";
          }
          if (value.length !== 10) {
            return "Product Number must be exactly 10 digits long.";
          }
        } else {
          return "Product Number must be a valid text.";
        }
        break;
      case "saleDate":
      case "orderDate":
        if (!value) {
          return `${field.label} is required.`;
        }
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return `${field.label} is invalid.`;
        }

        break;
      default:
        if (field.required) {
          if (typeof value === "string") {
            if (!value.trim()) {
              return `${field.label} is required.`;
            }
          } else if (!value) {
            return `${field.label} is required.`;
          }
        }
        break;
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {};

    const fieldsToValidate =
      fields && fields.length > 0 ? fields : dynamicFields;

    fieldsToValidate.forEach((field) => {
      const value = formData[field.name];
      const error = validateField(field, value);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);
    console.log("Validation Errors:", newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formular wird gesendet");
    if (validateForm()) {
      const preparedData = prepareFormDataForSubmit(formData);
      onSubmit(preparedData);
      onClose();
    } else {
      console.log("Formular enthält Fehler");
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  const fieldsToRender = fields && fields.length > 0 ? fields : dynamicFields;

  return (
    <div className="modal">
      <div className="modal__content">
        <span className="modal__close" onClick={handleClose}>
          &times;
        </span>
        <h2 className="modal__title">{title}</h2>
        <form className="modal__form" onSubmit={handleSubmit}>
          <div className="modal__form-group">
            {fieldsToRender &&
            Array.isArray(fieldsToRender) &&
            fieldsToRender.length > 0 ? (
              fieldsToRender.map((field) => (
                <div key={field.name} className="modal__form-row">
                  <label htmlFor={field.name} className="modal__label">
                    {field.label}:
                  </label>
                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      id={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleInputChange}
                      className={`modal__select ${errors[field.name] ? "error" : ""}`}
                    >
                      <option value="">
                        Select {field.label.toLowerCase()}
                      </option>
                      {field.options &&
                        field.options.map((option) =>
                          typeof option === "string" ? (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ) : (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          )
                        )}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      id={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleInputChange}
                      placeholder={field.placeholder || ""}
                      className={`modal__input ${errors[field.name] ? "error" : ""}`}
                      disabled={field.disabled || false}
                    />
                  )}
                  {errors[field.name] && (
                    <span className="modal__error">{errors[field.name]}</span>
                  )}
                </div>
              ))
            ) : (
              <div className="modal__no-fields">
                No fields available for editing. Please provide valid fields.
              </div>
            )}
            {formData.products &&
              Array.isArray(formData.products) &&
              formData.products.length > 0 && (
                <div className="modal__products-section">
                  <h3 className="modal__section-title">Products</h3>
                  {formData.products.map((product, index) => (
                    <div key={product.barcode} className="modal__form-row">
                      <label
                        htmlFor={`product-${index}`}
                        className="modal__label"
                      >
                        {product.barcode}:
                      </label>
                      <input
                        type="number"
                        name={`product-${index}-quantity`}
                        id={`product-${index}-quantity`}
                        value={product.quantity}
                        onChange={(e) =>
                          handleProductQuantityChange(
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                        className={`modal__input ${errors[`product-${index}-quantity`] ? "error" : ""}`}
                        placeholder="Quantity"
                      />
                      {product.price !== undefined && (
                        <input
                          type="number"
                          name={`product-${index}-price`}
                          id={`product-${index}-price`}
                          value={product.price}
                          onChange={(e) =>
                            handleProductQuantityChange(
                              index,
                              "price",
                              e.target.value
                            )
                          }
                          placeholder="Price"
                          className={`modal__input ${errors[`product-${index}-price`] ? "error" : ""}`}
                        />
                      )}
                      {errors[`product-${index}-quantity`] && (
                        <span className="modal__error">
                          {errors[`product-${index}-quantity`]}
                        </span>
                      )}
                      {errors[`product-${index}-price`] && (
                        <span className="modal__error">
                          {errors[`product-${index}-price`]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            {formData.status && (
              <div className="modal__form-row">
                <label htmlFor="status" className="modal__label">
                  Status:
                </label>
                <select
                  name="status"
                  id="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={`modal__select ${errors["status"] ? "error" : ""}`}
                >
                  <option value="">Select Status</option>
                  {["Ordered", "Pending", "Arrived", "Cancelled"].map(
                    (status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    )
                  )}
                </select>
                {errors["status"] && (
                  <span className="modal__error">{errors["status"]}</span>
                )}
              </div>
            )}
            {formData.source && (
              <div className="modal__form-row">
                <label htmlFor="source" className="modal__label">
                  Source:
                </label>
                <select
                  name="source"
                  id="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className={`modal__select ${errors["source"] ? "error" : ""}`}
                >
                  <option value="store">Store</option>
                </select>
                {errors["source"] && (
                  <span className="modal__error">{errors["source"]}</span>
                )}
              </div>
            )}
          </div>
          <div className="modal__button-group">
            <button
              type="button"
              className="modal__button modal__button--cancel"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal__button modal__button--update"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
          }),
        ])
      ),
      placeholder: PropTypes.string,
      defaultValue: PropTypes.string,
      disabled: PropTypes.bool,
      required: PropTypes.bool,
    })
  ),
  title: PropTypes.string,
  item: PropTypes.shape({
    products: PropTypes.arrayOf(
      PropTypes.shape({
        barcode: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        price: PropTypes.number,
      })
    ),
    orderDate: PropTypes.string,
    saleDate: PropTypes.string,
    status: PropTypes.oneOf(["Ordered", "Pending", "Arrived", "Cancelled"]),
    source: PropTypes.oneOf(["store"]),
  }),
};

export default EditModal;
