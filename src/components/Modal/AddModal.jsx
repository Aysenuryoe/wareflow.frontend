import React, { useState } from "react";
import PropTypes from "prop-types";

function AddModal({ isOpen, onClose, onSubmit, fields, title = "Add Item" }) {
  const initialFormState = fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue || "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateField = (field, value) => {
    switch (field.name) {
      case "article":
        if (!value.trim()) {
          return "Artikel is required.";
        }
        if (!/^[A-Za-z\s]+$/.test(value)) {
          return "Article can only contain letters and spaces.";
        }
        break;

      case "size":
        if (!value) {
          return "Size must be selected.";
        }
        if (!field.options.map((opt) => opt.value).includes(value)) {
          return "Invalid size selected.";
        }
        break;

      case "barcode":
        if (!value.trim()) {
          return "Barcode is required.";
        }
        if (!/^\d+$/.test(value)) {
          return "Barcode can only contain numbers.";
        }
        if (value.length !== 6) {
          return "Barcode must be exactly 6 digits long.";
        }
        break;

      case "price":
        if (value === "") {
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
        if (!value.trim()) {
          return "Product Number is required.";
        }
        if (!/^\d+$/.test(value)) {
          return "Product Number can only contain numbers.";
        }
        if (value.length !== 10) {
          return "Product Number must be exactly 10 digits long.";
        }
        break;

      default:
        if (field.required && !value.trim()) {
          return `${field.label} is required.`;
        }
        break;
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {};

    fields.forEach((field) => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      resetForm();
      onClose();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal--large">
      <div className="modal__content">
        <span className="modal__close" onClick={handleClose}>
          &times;
        </span>
        <h2 className="modal__title">{title}</h2>
        <form className="modal__form" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.name} className="modal__form-group">
              <div className="modal__form-row">
                <label htmlFor={field.name} className="modal__label">
                  {field.label}:
                </label>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    id={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    className="modal__select"
                  >
                    <option value="">Select {field.label.toLowerCase()}</option>
                    {field.options &&
                      field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    id={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className="modal__input"
                  />
                )}
              </div>
              {errors[field.name] && (
                <span className="modal__error">{errors[field.name]}</span>
              )}
            </div>
          ))}
          <div className="modal__button-group">
            <button
              type="button"
              className="modal__button modal__button--cancel"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button type="submit" className="modal__button modal__button--add">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      defaultValue: PropTypes.string,
      required: PropTypes.bool,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
  title: PropTypes.string,
};

export default AddModal;
