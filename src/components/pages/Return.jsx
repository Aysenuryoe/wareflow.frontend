import React, { useState, useEffect } from 'react'
import '../../styles/Return.css'

export default function Return() {
    const [products, setProducts] = useState([{ productId: '', quantity: 1, reason: '' }])
    const [status, setStatus] = useState('Pending')
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const [allProducts, setAllProducts] = useState([])
    const [loadingProducts, setLoadingProducts] = useState(true)
    const [fetchError, setFetchError] = useState('')

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await fetch('https://localhost:3001/api/product/all')
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
                const productsData = await response.json()
                setAllProducts(productsData)
                setLoadingProducts(false)
            } catch (err) {
                setFetchError('Fehler beim Laden der Produkte.')
                setLoadingProducts(false)
            }
        }
        fetchAllProducts()
    }, [])

    const addProduct = () => {
        setProducts([...products, { productId: '', quantity: 1, reason: '' }])
        setSuccessMessage('')
    }

    const removeProduct = (index) => {
        setProducts(products.filter((_, i) => i !== index))
        setSuccessMessage('')
    }

    const handleProductChange = (index, field, value) => {
        const updatedProducts = products.map((product, i) => (i === index ? { ...product, [field]: value } : product))
        setProducts(updatedProducts)
        setSuccessMessage('')
        setError('')
    }

    const handleStatusChange = (value) => {
        setStatus(value)
        setSuccessMessage('')
        setError('')
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        setError('')
        setSuccessMessage('')

        for (let i = 0; i < products.length; i++) {
            const p = products[i]
            if (!p.productId) {
                setError(`Bitte wählen Sie ein Produkt für Produkt ${i + 1}.`)
                return
            }
            if (!p.quantity || p.quantity < 1) {
                setError(`Bitte geben Sie eine gültige Menge für Produkt ${i + 1} ein.`)
                return
            }
            if (!p.reason) {
                setError(`Bitte geben Sie einen Rückgabegrund für Produkt ${i + 1} ein.`)
                return
            }
        }

        if (status !== 'Completed') {
            setError("Der Status muss auf 'Abgeschlossen' gesetzt sein, um die Rückgabe abzuschicken.")
            return
        }

        const returnData = {
            products,
            status,
            createdAt: new Date()
        }

        try {
            const response = await fetch('https://localhost:3001/api/return/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(returnData)
            })

            if (response.ok) {
                setSuccessMessage('Die Rückgabe ist erfolgreich abgeschlossen.')
                setProducts([{ productId: '', quantity: 1, reason: '' }])
                setStatus('Pending')
                setError('')
            } else {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Fehler bei der Rückgabe')
            }
        } catch (error) {
            console.error(error)
            setError(`Fehler beim Erstellen der Rückgabe: ${error.message}`)
            setSuccessMessage('')
        }
    }

    const combinedProductOptions = allProducts.map((product) => ({
        label: `${product.name} - Größe: ${product.size}`,
        value: product.id
    }))

    return (
        <div className="return-container">
            <h2 className="return-title">Rückgabeformular</h2>
            {loadingProducts ? (
                <p>Produkte werden geladen...</p>
            ) : fetchError ? (
                <p className="error-message">{fetchError}</p>
            ) : (
                <form className="return-form" onSubmit={handleSubmit}>
                    {products.map((product, index) => (
                        <div key={index} className="product-section">
                            <h3 className="product-title">Produkt {index + 1}</h3>
                            <div className="form-group">
                                <label className="form-label">Produkt:</label>
                                <select
                                    className="form-input"
                                    value={product.productId}
                                    onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                                    required
                                >
                                    <option value="">Produkt auswählen</option>
                                    {combinedProductOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Rückgabe Menge:</label>
                                <input
                                    className="form-input"
                                    type="number"
                                    min="1"
                                    value={product.quantity}
                                    onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Grund der Rückgabe:</label>
                                <input
                                    className="form-input"
                                    type="text"
                                    value={product.reason}
                                    onChange={(e) => handleProductChange(index, 'reason', e.target.value)}
                                    required
                                    placeholder="z.B. Defekt, Falsches Produkt"
                                />
                            </div>
                            <div className="btn-group">
                                <button className="delete-item-btn" type="button" onClick={() => removeProduct(index)}>
                                    Entfernen
                                </button>
                                <button className="add-item-btn" type="button" onClick={addProduct}>
                                    Weiteres Produkt
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="form-group">
                        <label className="form-label">Status:</label>
                        <select
                            className="form-input"
                            value={status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                        >
                            <option value="Pending">Ausstehend</option>
                            <option value="Completed">Abgeschlossen</option>
                        </select>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    <div className="button-group">
                        <button className="submit-btn" type="submit">
                            Rückgabe abschicken
                        </button>
                    </div>
                    {successMessage && <p className="success-message">{successMessage}</p>}
                </form>
            )}
        </div>
    )
}
