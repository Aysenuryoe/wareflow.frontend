import React from 'react';
import '../styles/SalesCard.css';

const SaleCard = ({ sale, onEdit, onDelete, calculateTotalAmount }) => {
  return (
    <div className="sale-card">
      <div>
        <div className="sale-card-header">
          <h2>{new Date(sale.saleDate).toLocaleDateString()}</h2>
          <div className="sale-actions">
            <button
              onClick={() => onEdit(sale)}
              className="icon-button edit-icon"
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              onClick={() => onDelete(sale)}
              className="icon-button delete-icon"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div className="sale-products">
          {sale.products.map((product, index) => (
            <div key={index} className="product-item">
              <span>
                {product.barcode} - {product.price}$ (x{product.quantity})
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="sale-total">
        Total Amount: {calculateTotalAmount(sale.products).toFixed(2)}$
      </div>
    </div>
  );
};

export default SaleCard;
