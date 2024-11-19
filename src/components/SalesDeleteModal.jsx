import React from "react";

const SalesDeleteModal = ({ isOpen, onClose, onSubmit, sale, title = "Delete Sale" }) => {
    if (!isOpen) return null;  // Modal wird nur angezeigt, wenn `isOpen` true ist

    const handleDelete = async () => {
        await onSubmit();
        onClose();
    };

    return (
        <div className="modal large">
            <div className="modal-content">
                <span className="close" onClick={onClose}>
                    &times;
                </span>
                <h2>{title}</h2>
                <p>Are you sure you want to delete this sale?</p>
                <div className="btn-control">
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="delete-btn" onClick={handleDelete}>
                        Confirm Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SalesDeleteModal;
