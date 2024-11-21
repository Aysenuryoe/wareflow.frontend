// src/components/Modal/DeleteModal.jsx

import React from "react";
import PropTypes from "prop-types";

function DeleteModal({ isOpen, onClose, onSubmit, itemName = "item" }) {
  if (!isOpen) return null;

  const handleDelete = async () => {
    await onSubmit();
    onClose();
  };

  return (
    <div className="modal modal--small">
      <div className="modal__content">
        <span className="modal__close" onClick={onClose}>
          &times;
        </span>
        <h2 className="modal__title">{`Delete ${itemName}`}</h2>
        <p className="modal__message">{`Are you sure you want to delete this ${itemName}?`}</p>
        <div className="modal__button-group">
          <button
            type="button"
            className="modal__button modal__button--cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="modal__button modal__button--delete"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  itemName: PropTypes.string,
};

export default DeleteModal;
