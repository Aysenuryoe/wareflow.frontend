// SalesCard.jsx
import React from "react";
import "./SalesCard.css";

const SalesCard = ({ sale, onEdit, onDelete }) => {
   
    return (
        <div className="sales-card">
         
            <div className="card-icons">
                <i className="fas fa-edit icon edit-icon" onClick={onEdit}></i>
                <i className="fas fa-trash icon delete-icon" onClick={onDelete}></i>
            </div>

            <h3>Sale Date: {new Date(sale.saleDate).toLocaleDateString()}</h3>

            <div className="products-list">
                {sale.products.map((product, index) => (
                    <div key={index} className="product-item">
                        <p><strong>Barcode:</strong> {product.barcode}</p>
                        <p><strong>Price:</strong> ${product.price ? product.price.toFixed(2) : "0.00"}</p>
                        <p><strong>Quantity:</strong> {product.quantity}</p>
                    </div>
                ))}
            </div>
            <div>Source:{sale.source}</div>

            <div className="total-amount">
              {/* //  Total Amount: ${totalAmount} */}
            </div>
        </div>
    );
};

export default SalesCard;
