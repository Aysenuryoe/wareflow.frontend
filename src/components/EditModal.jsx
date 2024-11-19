import React, { useState, useEffect } from "react";

function EditModal({ isOpen, onClose, onSubmit, fields, title = "Edit Item", item, products }) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (item) {
            setFormData(item);
        }
    }, [item]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        await onSubmit(formData);
        onClose(); 
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal large">
            <div className="modal-content">
                <span className="close" onClick={handleClose}>
                    &times;
                </span>
                <h2>{title}</h2>
                <div className="form-group">
                    {fields.map((field) => (
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
                                    {field.options.map((option) => (
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
                                    placeholder={field.placeholder}
                                    className="p-2.5 rounded-md"
                                />
                            )}
                        </div>
                    ))}
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

export default EditModal;
