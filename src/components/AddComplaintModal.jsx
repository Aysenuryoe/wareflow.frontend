import React, { useState, useEffect } from 'react'
import '../styles/Modal.css'

function AddComplaintModal({ isOpen, onClose, onAdd }) {
    const [products, setProducts] = useState([])
    const [formData, setFormData] = useState({
        referenceType: 'GoodsReceipt',
        products: [{ productId: '', quantity: 1, reason: '' }],
        status: 'Open'
    })

    const [loading, setLoading] = useState(false)
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

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prevState) => ({ ...prevState, [name]: value }))
    }

    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...formData.products]
        updatedProducts[index][field] = field === 'quantity' ? parseInt(value, 10) : value
        setFormData((prevState) => ({ ...prevState, products: updatedProducts }))
    }

    const addProductField = () => {
        setFormData((prevState) => ({
            ...prevState,
            products: [...prevState.products, { productId: '', quantity: 1, reason: '' }]
        }))
    }

    const removeProductField = (index) => {
        setFormData((prevState) => ({
            ...prevState,
            products: prevState.products.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Formulardaten:', formData)
        onAdd(formData)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="modal-container">
            <div className="modal">
                <h2>Reklamation erstellen</h2>

                {loading ? (
                    <p>Produkte werden geladen...</p>
                ) : error ? (
                    <p>Fehler: {error}</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <div className="input-row">
                                <label>Referenztyp:</label>

                                <select
                                    className="form-control"
                                    name="referenceType"
                                    value={formData.referenceType}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="GoodsReceipt">Wareneingang</option>
                                    <option value="Sales">Verkauf</option>
                                </select>
                            </div>
                        </div>

                        {formData.products.map((product, index) => (
                            <div key={index} className="product-group">
                                <div className="form-group">
                                    <div className="input-row">
                                        <label>Produkt:</label>
                                        <select
                                            className="form-control"
                                            value={product.productId}
                                            onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                                            required
                                        >
                                            <option value="">Produkt auswählen</option>
                                            {products.map((prod) => (
                                                <option key={prod.id} value={prod.id}>
                                                    {prod.name} - {prod.size}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-row">
                                        <label>Menge:</label>
                                        <input
                                            type="number"
                                            value={product.quantity}
                                            onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                            min="1"
                                            required
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-row">
                                        <label>Grund:</label>
                                        <input
                                            type="text"
                                            value={product.reason}
                                            onChange={(e) => handleProductChange(index, 'reason', e.target.value)}
                                            required
                                            className="form-control"
                                        />
                                    </div>
                                </div>

                                <div className="button-group">
                                    <button
                                        type="button"
                                        onClick={() => removeProductField(index)}
                                        className="remove-btn">
                                        Entfernen
                                    </button>

                                    <button type="button" onClick={addProductField} className="add-product-btn">
                                        Produkt hinzufügen
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="form-group">
                            <div className="input-row">
                                <label>Status:</label>
                                <select
                                    className="form-control"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Open">Offen</option>
                                    <option value="Resolved">Gelöst</option>
                                </select>
                            </div>
                        </div>

                        <div className="button-group">
                            <button type="button" onClick={onClose} className="cancel-btn">
                                Abbrechen
                            </button>
                            <button type="submit" className="submit-btn">
                                Erstellen
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default AddComplaintModal
