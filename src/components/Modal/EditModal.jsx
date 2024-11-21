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

  useEffect(() => {
    if (item) {
      const updatedItem = { ...item };
      if (item.orderDate || item.saleDate) {
        const dateField = item.orderDate ? "orderDate" : "saleDate";
        updatedItem[dateField] = item[dateField].split("T")[0];
      }
      setFormData(updatedItem);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProductQuantityChange = (index, field, value) => {
    setFormData((prevData) => {
      const updatedProducts = prevData.products ? [...prevData.products] : [];
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]:
          field === "quantity" || field === "price" ? parseFloat(value) : value,
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
      const dateField = preparedData.orderDate ? "orderDate" : "saleDate";
      preparedData[dateField] = `${preparedData[dateField]}T00:00:00.000Z`;
    }
    return preparedData;
  };

  const handleSubmit = async () => {
    const preparedData = prepareFormDataForSubmit(formData);
    await onSubmit(preparedData);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

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
                        handleProductQuantityChange(
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                      className="p-2.5 rounded-md"
                    />
                    {product.price !== undefined && (
                      <input
                        type="number"
                        name={`product-${index}-price`}
                        value={product.price}
                        onChange={(e) =>
                          handleProductQuantityChange(
                            index,
                            "price",
                            e.target.value
                          )
                        }
                        placeholder="Price"
                        className="p-2.5 rounded-md"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          {formData.status && (
            <div className="form-row">
              <label htmlFor="status">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="p-2.5 rounded-md"
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
            </div>
          )}
          {formData.source && (
            <div className="form-row">
              <label htmlFor="source">Source</label>
              <select
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                className="p-2.5 rounded-md"
              >
                <option value="store">Store</option>
              </select>
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
