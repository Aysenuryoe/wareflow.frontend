import React from "react";
import "../styles/SalesCard.css";

const SaleCard = ({ sale, onEdit, onDelete, calculateTotalAmount }) => {
  return (
    <div className="sale-card">
      <div className="sale-card__header">
        <h2 className="sale-card__date">
          {new Date(sale.saleDate).toLocaleDateString()}
        </h2>
        <div className="sale-card__actions">
          <button
            onClick={() => onEdit(sale)}
            className="sale-card__icon-button sale-card__icon-button--edit"
            aria-label="Edit Sale"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            onClick={() => onDelete(sale)}
            className="sale-card__icon-button sale-card__icon-button--delete"
            aria-label="Delete Sale"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div className="sale-card__products">
        {sale.products.map((product, index) => (
          <div key={index} className="sale-card__product-item">
            <span className="sale-card__product-details">
              {product.barcode} - {product.price}$ (x{product.quantity})
            </span>
          </div>
        ))}
      </div>
      <div className="sale-card__total">
        Total Amount: {calculateTotalAmount(sale.products).toFixed(2)}$
      </div>
    </div>
  );
};


export default SaleCard;
