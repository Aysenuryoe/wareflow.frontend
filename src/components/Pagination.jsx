import React from 'react'
import '../styles/Pagination.css'

function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return
        onPageChange(page)
    }

    return (
        <div className="pagination-wrapper">
            <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Vorher
                </button>
                <span>
                    Seite {currentPage} of {totalPages}
                </span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Nachher
                </button>
            </div>
        </div>
    )
}

export default Pagination
