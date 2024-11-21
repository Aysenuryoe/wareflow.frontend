import React from "react";

function DeleteModal({ isOpen, onClose, onSubmit, itemName = "item" }) {
  if (!isOpen) return null;

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
        <h2>{`Delete ${itemName}`}</h2>
        <p>Are you sure you want to delete this {itemName}?</p>
        <div className="btn-control">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-btn" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
