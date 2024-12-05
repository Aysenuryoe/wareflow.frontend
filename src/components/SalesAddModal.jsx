import React, { useState, useEffect } from 'react'
import "../styles/Modal.css"

export default function SalesAddModal({ closeModal, onSubmit }) {
    const [products, setProducts] = useState([])
    const [saleProducts, setSaleProducts] = useState([{ productId: '', price: '', quantity: 1 }])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://localhost:3001/api/product/all')
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
                const productsData = await response.json()
                setProducts(productsData)
                setLoading(false)
            } catch (err) {
                setError('Failed to load products.')
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...saleProducts]
        updatedProducts[index][field] = value
        setSaleProducts(updatedProducts)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const saleData = {
          products: saleProducts.map(({ productId, price, quantity }) => {
            const product = products.find((p) => p.id === productId); 
            return {
              productId,
              name: product ? product.name : '',
              price: parseFloat(price),
              quantity: parseInt(quantity, 10)
            };
          }),
          totalAmount: saleProducts.reduce((total, item) => total + item.price * item.quantity, 0),
          createdAt: new Date().toISOString()
        };
        onSubmit(saleData);
      };
      

    const addProduct = () => {
        setSaleProducts([...saleProducts, { productId: '', price: '', quantity: 1 }])
    }

    const removeProduct = (index) => {
        setSaleProducts(saleProducts.filter((_, i) => i !== index))
    }

    return (
        <div className="modal-container">
    <div className="modal">
        <h2>Neuen Verkauf erstellen</h2>
        <form onSubmit={handleSubmit}>
            {saleProducts.map((product, index) => (
                <div key={index} >
                    <div className='form-group'>
                    <label>Produkte:</label>
                    <select
                        className="form-control"
                        value={product.productId}
                        onChange={(e) => handleProductChange(index, "productId", e.target.value)}
                    >
                        <option value="">Produkt auswählen</option>
                        {products.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name} -- {p.size}
                            </option>
                        ))}
                    </select>
                    </div>
                    <div className='form-group'>
                    <label>Preis:</label>
                    <input
                        className="form-control"
                        type="number"
                        placeholder="Preis"
                        value={product.price}
                        onChange={(e) => handleProductChange(index, "price", e.target.value)}
                    />
                    </div>
                    <div className='form-group'>
                    <label>Menge:</label>
                    <input
                        className="form-control"
                        type="number"
                       
                        value={product.quantity}
                        onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                    />
                    </div>
                    <button
                        type="button"
                        onClick={() => removeProduct(index)}
                        className="remove-btn"
                    >
                        Entfernen
                    </button>
                </div>
            ))}
            <button type="button" onClick={addProduct} className="add-product-btn">
                Neues Produkt hinzufügen
            </button>
            <div className="button-group">
                <button type="button" onClick={closeModal} className="cancel-btn">
                    Abbrechen
                </button>
                <button type="submit" className="submit-btn">
                    Speichern
                </button>
            </div>
        </form>
    </div>
</div>
    )
}
