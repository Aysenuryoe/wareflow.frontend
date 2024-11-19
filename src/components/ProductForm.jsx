// ProductForm.jsx
import React from "react";
import "./ProductForm.css";

const ProductForm = ({ product = {}, setProduct, isReadOnly }) => (
    <div className="product-form">
        <div className="form-group">
            <label>Article Name:</label>
            <input 
                type="text" 
                value={product.article || ''} 
                readOnly={isReadOnly} 
                onChange={(e) => setProduct({ ...product, article: e.target.value })} 
            />
        </div>

        <div className="form-group">
            <label>Size:</label>
            <select 
                value={product.size || ''} 
                disabled={isReadOnly} 
                onChange={(e) => setProduct({ ...product, size: e.target.value })}
            >
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="NOSIZE">NOSIZE</option>
            </select>
        </div>

        <div className="form-group">
            <label>Barcode:</label>
            <input 
                type="text" 
                value={product.barcode || ''} 
                readOnly={isReadOnly} 
                onChange={(e) => setProduct({ ...product, barcode: e.target.value })} 
            />
        </div>

        <div className="form-group">
            <label>Price:</label>
            <input 
                type="number" 
                value={product.price ?? 0} // Verwende 0 als Standardwert, falls undefined
                readOnly={isReadOnly} 
                onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) || 0 })} 
            />
        </div>

        <div className="form-group">
            <label>Product Number:</label>
            <input 
                type="text" 
                value={product.productNum || ''} 
                readOnly={isReadOnly} 
                onChange={(e) => setProduct({ ...product, productNum: e.target.value })} 
            />
        </div>

        <div className="form-group">
            <label>Stock:</label>
            <input 
                type="number" 
                value={product.stock ?? 0} // Verwende 0 als Standardwert, falls undefined
                readOnly={isReadOnly} 
                onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) || 0 })} 
            />
        </div>
    </div>
);

export default ProductForm;
