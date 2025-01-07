import React, { useState, useEffect } from 'react'
import '../styles/Modal.css'

export default function PurchaseAddModal({ onClose, onSave }) {
    const [products, setProducts] = useState([])
    const [purchaseData, setPurchaseData] = useState({
        supplier: '',
        status: '',
        orderDate: '',
        products: [{ productId: '', quantity: 1, size: '' }]
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [submitError, setSubmitError] = useState('')

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://localhost:3001/api/product/all')
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
                const productsData = await response.json()
                setProducts(productsData)
                setLoading(false)
            } catch (err) {
                setError('Produkte konnten nicht geladen werden.')
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const validateField = (name, value) => {
        let error = ''
        if (name === 'supplier' && !value.trim()) {
            error = 'Lieferant ist erforderlich.'
        } else if (name === 'status' && !value) {
            error = 'Status ist erforderlich.'
        } else if (name === 'orderDate' && !value) {
            error = 'Bestelldatum ist erforderlich.'
        } else if (name === 'products') {
            value.forEach((item, index) => {
                if (!item.productId) {
                    error = `Produkt ${index + 1} ist erforderlich.`
                }
                if (!item.quantity || item.quantity <= 0) {
                    error = `Menge für Produkt ${index + 1} muss positiv sein.`
                }
                if (!item.size) {
                    error = `Größe für Produkt ${index + 1} ist erforderlich.`
                }
            })
        }
        return error
    }

    const validateForm = () => {
        const newErrors = {}
        newErrors.supplier = validateField('supplier', purchaseData.supplier)
        newErrors.status = validateField('status', purchaseData.status)
        newErrors.orderDate = validateField('orderDate', purchaseData.orderDate)
        newErrors.products = validateField('products', purchaseData.products)

        setErrors(newErrors)
        return Object.values(newErrors).every((err) => !err)
    }

    const handleInputChange = (name, value) => {
        setPurchaseData((prev) => ({
            ...prev,
            [name]: value
        }))
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validateField(name, value)
        }))
    }

    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...purchaseData.products]

        if (field === 'quantity') {
            updatedProducts[index][field] = parseInt(value, 10)
        } else if (field === 'productId') {
            updatedProducts[index].productId = value

            const foundProduct = products.find((p) => p.id === value)
            if (foundProduct) {
                updatedProducts[index].size = foundProduct.size || ''
            } else {
                updatedProducts[index].size = ''
            }
        }

        setPurchaseData((prev) => ({ ...prev, products: updatedProducts }))
        setErrors((prevErrors) => ({
            ...prevErrors,
            products: validateField('products', updatedProducts)
        }))
    }

    const addProduct = () => {
        setPurchaseData((prev) => ({
            ...prev,
            products: [...prev.products, { productId: '', quantity: 1, size: '' }]
        }))
    }

    const removeProduct = (index) => {
        setPurchaseData((prev) => ({
            ...prev,
            products: prev.products.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitError('')
        setSuccessMessage('')

        if (validateForm()) {
            const result = await onSave(purchaseData)
            if (result.success) {
                setSuccessMessage('Bestellung erfolgreich erstellt.')
                setTimeout(() => {
                    setSuccessMessage('')
                    onClose()
                }, 2000)
            } else {
                setSubmitError(result.message || 'Fehler beim Erstellen der Bestellung.')
            }
        } else {
            setSubmitError('Bitte überprüfen Sie die Eingabefelder.')
        }
    }

    return (
        <div className="modal-container">
            <div className="modal">
                <h2>Neue Bestellung hinzufügen</h2>
                {loading ? (
                    <p>Produkte werden geladen...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-container">
                            <div className="form-group">
                                <div className="input-row">
                                    <label htmlFor="supplier">Lieferant:</label>
                                    <input
                                        id="supplier"
                                        type="text"
                                        name="supplier"
                                        value={purchaseData.supplier}
                                        onChange={(e) => handleInputChange('supplier', e.target.value)}
                                        className={errors.supplier ? 'input-error' : ''}
                                    />
                                </div>
                                {errors.supplier && <span className="error-message">{errors.supplier}</span>}
                            </div>

                            <div className="form-group">
                                <div className="input-row">
                                    <label htmlFor="status">Status:</label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={purchaseData.status}
                                        onChange={(e) => handleInputChange('status', e.target.value)}
                                        className={errors.status ? 'input-error' : ''}
                                    >
                                        <option value="">Status auswählen</option>
                                        <option value="Ordered">Bestellt</option>
                                        <option value="Pending">Ausstehend</option>
                                        <option value="Arrived">Angekommen</option>
                                        <option value="Cancelled">Storniert</option>
                                    </select>
                                </div>
                                {errors.status && <span className="error-message">{errors.status}</span>}
                            </div>

                            <div className="form-group">
                                <div className="input-row">
                                    <label htmlFor="orderDate">Bestelldatum:</label>
                                    <input
                                        id="orderDate"
                                        type="date"
                                        name="orderDate"
                                        value={purchaseData.orderDate}
                                        onChange={(e) => handleInputChange('orderDate', e.target.value)}
                                        className={errors.orderDate ? 'input-error' : ''}
                                    />
                                </div>
                                {errors.orderDate && <span className="error-message">{errors.orderDate}</span>}
                            </div>

                            <h3>Produkte</h3>
                            {purchaseData.products.map((item, index) => (
                                <div key={index} className="product-row">
                                    <div className="form-group">
                                        <div className="input-row">
                                            <label>Produkt:</label>
                                            <select
                                                value={item.productId}
                                                onChange={(e) =>
                                                    handleProductChange(index, 'productId', e.target.value)
                                                }
                                                className="form-control"
                                            >
                                                <option value="">Produkt auswählen</option>
                                                {products.map((product) => (
                                                    <option key={product.id} value={product.id}>
                                                        {product.name} -- Größe: {product.size}
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
                                                value={item.quantity}
                                                min="1"
                                                onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>

                                    <div className="button-group">
                                        <button
                                            type="button"
                                            onClick={() => removeProduct(index)}
                                            className="remove-btn"
                                        >
                                            Entfernen
                                        </button>
                                        <button type="button" onClick={addProduct} className="add-product-btn">
                                            Produkt hinzufügen
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {submitError && <div className="submit-error-message">{submitError}</div>}
                            {successMessage && <div className="success-message">{successMessage}</div>}

                            <div className="button-group">
                                <button type="button" onClick={onClose} className="cancel-btn">
                                    Abbrechen
                                </button>
                                <button type="submit" className="submit-btn">
                                    Speichern
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
