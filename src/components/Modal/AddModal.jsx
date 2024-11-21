
import React, { useState } from "react";
import PropTypes from "prop-types";


function AddModal({ isOpen, onClose, onSubmit, fields, title = "Add Item" }) {
  const initialFormState = fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue || "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormState);

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    resetForm();
    onClose();
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
            <button
              type="submit"
              className="modal__button modal__button--add"
            >
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
