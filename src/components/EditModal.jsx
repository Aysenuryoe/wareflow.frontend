import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function EditModal({
  isOpen,
  onClose,
  onSubmit,
  fields,
  title = "Edit Item",
  item,
}) {
  const [formData, setFormData] = useState({});
  const [dynamicFields, setDynamicFields] = useState([]);

  // Set initial form data when item changes
  useEffect(() => {
    if (item) {
      console.log("EditModal received item:", item); // Debugging output to ensure item is correctly passed
      const updatedItem = { ...item };
      if (item.orderDate) {
        updatedItem.orderDate = item.orderDate.split("T")[0]; // Extract the date part before 'T'
      }
      setFormData(updatedItem);

      // Generate fields dynamically if fields prop is not provided
      if (!fields || fields.length === 0) {
        const generatedFields = Object.keys(updatedItem)
          .filter((key) => key !== "id" && key !== "products")
          .map((key) => {
            return {
              name: key,
              label: key.charAt(0).toUpperCase() + key.slice(1),
              type: typeof updatedItem[key] === "number" ? "number" : "text",
            };
          });
        setDynamicFields(generatedFields);
      }
    }
  }, [item, fields]);

  // Handle changes in input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle changes in product quantities
  const handleProductQuantityChange = (index, value) => {
    setFormData((prevData) => {
      const updatedProducts = prevData.products ? [...prevData.products] : [];
      updatedProducts[index] = {
        ...updatedProducts[index],
        quantity: parseInt(value, 10),
      };
      return {
        ...prevData,
        products: updatedProducts,
      };
    });
  };

  // Convert form data back to API-friendly format before submitting
  const prepareFormDataForSubmit = (data) => {
    const preparedData = { ...data };
    if (preparedData.orderDate) {
      preparedData.orderDate = `${preparedData.orderDate}T00:00:00.000Z`; // Append time part to make it ISO-compliant
    }
    return preparedData;
  };

  // Submit the form data
  const handleSubmit = async () => {
    const preparedData = prepareFormDataForSubmit(formData);
    await onSubmit(preparedData);
    onClose();
  };

  // Close the modal
  const handleClose = () => {
    onClose();
  };

  // Render nothing if modal is not open
  if (!isOpen) return null;

  const fieldsToRender = fields && fields.length > 0 ? fields : dynamicFields;

  return (
    <div className="modal large">
      <div className="modal-content">
        <span className="close" onClick={handleClose}>
          &times;
        </span>
        <h2>{title}</h2>
        <div className="form-group">
          {/* Render each field dynamically based on the fields prop or dynamicFields */}
          {fieldsToRender &&
          Array.isArray(fieldsToRender) &&
          fieldsToRender.length > 0 ? (
            fieldsToRender.map((field) => (
              <div key={field.name} className="form-row">
                <label htmlFor={field.name}>{field.label}</label>

                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                    className="p-2.5 rounded-md"
                  >
                    <option value="">Select {field.label}</option>
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
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                    placeholder={field.placeholder || ""}
                    className="p-2.5 rounded-md"
                  />
                )}
              </div>
            ))
          ) : (
            <div>
              No fields available for editing. Please provide valid fields.
            </div>
          )}
          {/* Render products with editable quantities */}
          {formData.products &&
            Array.isArray(formData.products) &&
            formData.products.length > 0 && (
              <div className="products-section">
                <h3>Products</h3>
                {formData.products.map((product, index) => (
                  <div key={product.barcode} className="form-row">
                    <label htmlFor={`product-${index}`}>
                      {product.barcode}
                    </label>
                    <input
                      type="number"
                      name={`product-${index}-quantity`}
                      value={product.quantity}
                      onChange={(e) =>
                        handleProductQuantityChange(index, e.target.value)
                      }
                      className="p-2.5 rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}
          <div className="btn-control">
            <button className="cancel-btn" onClick={handleClose}>
              Cancel
            </button>
            <button className="update-btn" onClick={handleSubmit}>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Default props to ensure fields is always an array
EditModal.defaultProps = {
  fields: [],
};

// PropTypes to validate the props passed to EditModal
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
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
    })
  ),
  title: PropTypes.string,
  item: PropTypes.object,
};

export default EditModal;
