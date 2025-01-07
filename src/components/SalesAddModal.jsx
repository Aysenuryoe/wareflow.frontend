import React, { useState, useEffect } from 'react'
import '../styles/Modal.css'

export default function SalesAddModal({ closeModal, onSubmit }) {
    const [products, setProducts] = useState([])
    const [saleProducts, setSaleProducts] = useState([{ productId: '', price: '', quantity: 1 }])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState('')
    const [errors, setErrors] = useState([{ productId: '', price: '', quantity: '' }])

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
        const updatedSaleProducts = [...saleProducts]
        updatedSaleProducts[index][field] = value

        if (field === 'productId') {
            const selectedProduct = products.find((p) => p.id === value)
            if (selectedProduct) {
                updatedSaleProducts[index].price = selectedProduct.price
            } else {
                updatedSaleProducts[index].price = ''
            }
        }

        setSaleProducts(updatedSaleProducts)

        const updatedErrors = [...errors]
        updatedErrors[index][field] = ''
        setErrors(updatedErrors)
    }

    const validateField = (field, value, index) => {
        let message = ''

        switch (field) {
            case 'productId':
                if (!value) {
                    message = 'Bitte ein Produkt auswählen.'
                }
                break
            case 'price':
                if (value === '') {
                    message = 'Preis ist erforderlich.'
                } else if (isNaN(value) || Number(value) < 0) {
                    message = 'Preis muss eine positive Zahl sein.'
                }
                break
            case 'quantity':
                if (value === '') {
                    message = 'Menge ist erforderlich.'
                } else if (!Number.isInteger(Number(value)) || Number(value) < 1) {
                    message = 'Menge muss eine ganze Zahl größer als 0 sein.'
                }
                break
            default:
                break
        }

        return message
    }

    const validateForm = () => {
        const newErrors = saleProducts.map((product, index) => {
            return {
                productId: validateField('productId', product.productId, index),
                price: validateField('price', product.price, index),
                quantity: validateField('quantity', product.quantity, index)
            }
        })

        setErrors(newErrors)

        const hasErrors = newErrors.some((error) => error.productId || error.price || error.quantity)

        return !hasErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        const saleData = {
            products: saleProducts.map(({ productId, price, quantity }) => {
                const product = products.find((p) => p.id === productId)
                return {
                    productId,
                    name: product ? product.name : '',
                    price: parseFloat(price),
                    quantity: parseInt(quantity, 10)
                }
            }),
            totalAmount: saleProducts.reduce((total, item) => total + item.price * item.quantity, 0),
            createdAt: new Date().toISOString()
        }

        try {
            const success = await onSubmit(saleData)
            if (success) {
                setSuccessMessage('Verkauf erfolgreich hinzugefügt.')

                setTimeout(() => {
                    closeModal()
                }, 2000)
            } else {
                setError('Fehler beim Hinzufügen des Verkaufs.')
            }
        } catch (err) {
            console.error('Error during submission:', err)
            setError('Fehler beim Hinzufügen des Verkaufs.')
        }
    }

    const addProduct = () => {
        setSaleProducts([...saleProducts, { productId: '', price: '', quantity: 1 }])
        setErrors([...errors, { productId: '', price: '', quantity: '' }])
    }

    const removeProduct = (index) => {
        const updatedSaleProducts = saleProducts.filter((_, i) => i !== index)
        const updatedErrors = errors.filter((_, i) => i !== index)
        setSaleProducts(updatedSaleProducts)
        setErrors(updatedErrors)
    }

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('')
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [successMessage])

    if (loading) {
        return (
            <div className="modal-container">
                <div className="modal">
                    <h2>Neuen Verkauf erstellen</h2>
                    <p>Loading...</p>
                </div>
            </div>
        )
    }

    if (error && !successMessage) {
        return (
            <div className="modal-container">
                <div className="modal">
                    <h2>Neuen Verkauf erstellen</h2>
                    <p className="error-message">{error}</p>
                    <div className="button-group">
                        <button type="button" onClick={closeModal} className="cancel-btn">
                            Abbrechen
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="modal-container">
            <div className="modal">
                <h2>Neuen Verkauf erstellen</h2>
                <div className="form-container">
                    <form onSubmit={handleSubmit} noValidate>
                        {saleProducts.map((product, index) => (
                            <div key={index} className="sale-product-group">
                                <div className="form-group">
                                    <div className="input-row">
                                        <label htmlFor={`product-${index}`}>Produkte:</label>
                                        <select
                                            id={`product-${index}`}
                                            name={`product-${index}`}
                                            className={`form-control ${errors[index].productId ? 'input-error' : ''}`}
                                            value={product.productId}
                                            onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                                            required
                                            aria-describedby={`product-${index}-error`}
                                        >
                                            <option value="">Produkt auswählen</option>
                                            {products.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} -- {p.size}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors[index].productId && (
                                        <span id={`product-${index}-error`} className="error-message">
                                            {errors[index].productId}
                                        </span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <div className="input-row">
                                        <label htmlFor={`price-${index}`}>Preis (€):</label>
                                        <input
                                            id={`price-${index}`}
                                            name={`price-${index}`}
                                            className={`form-control ${errors[index].price ? 'input-error' : ''}`}
                                            type="number"
                                            placeholder="Preis in €"
                                            value={product.price}
                                            onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                                            required
                                            step="0.01"
                                            min="0"
                                            aria-describedby={`price-${index}-error`}
                                        />
                                    </div>
                                    {errors[index].price && (
                                        <span id={`price-${index}-error`} className="error-message">
                                            {errors[index].price}
                                        </span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <div className="input-row">
                                        <label htmlFor={`quantity-${index}`}>Menge:</label>
                                        <input
                                            id={`quantity-${index}`}
                                            name={`quantity-${index}`}
                                            className={`form-control ${errors[index].quantity ? 'input-error' : ''}`}
                                            type="number"
                                            value={product.quantity}
                                            onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                            required
                                            min="1"
                                            aria-describedby={`quantity-${index}-error`}
                                        />
                                    </div>
                                    {errors[index].quantity && (
                                        <span id={`quantity-${index}-error`} className="error-message">
                                            {errors[index].quantity}
                                        </span>
                                    )}
                                </div>

                                <div className="button-group">
                                    <button type="button" onClick={() => removeProduct(index)} className="remove-btn">
                                        Entfernen
                                    </button>
                                    <button type="button" onClick={addProduct} className="add-product-btn">
                                        Produkt hinzufügen
                                    </button>
                                </div>
                            </div>
                        ))}

                        {error && <div className="error-message">{error}</div>}
                        {successMessage && <div className="success-message">{successMessage}</div>}

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
        </div>
    )
}
