import React from 'react'
import '../styles/Modal.css'

const DeleteModal = ({
    closeModal,
    onConfirm,
    title = 'Löschen bestätigen',
    message = 'Sind Sie sicher, dass Sie dieses Element löschen möchten?',
    confirmText = 'Löschen',
    cancelText = 'Abbrechen'
}) => {
    return (
        <div className="modal-container">
            <div className="modal">
                <h2>{title}</h2>
                <p>{message}</p>
                <div className="button-group">
                    <button type="button" onClick={closeModal} className="cancel-btn">
                        {cancelText}
                    </button>
                    <button type="button" onClick={onConfirm} className="danger-btn">
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal
