import React, { useState, useEffect } from 'react'
import '../styles/Modal.css'

function PurchaseEditModal({ closeModal, onSubmit, defaultValue }) {
    const [formData, setFormData] = useState({
        products: [],
        supplier: '',
        status: '',
        orderDate: '',
        receivedDate: ''
    })
    const [errors, setErrors] = useState({})
    const [successMessage, setSuccessMessage] = useState('')
    const [submitError, setSubmitError] = useState('')

    useEffect(() => {
        if (defaultValue) {
            setFormData({
                ...defaultValue,
                products: defaultValue.products || [],
                supplier: defaultValue.supplier || '',
                status: defaultValue.status || 'Ordered',
                orderDate: defaultValue.orderDate ? new Date(defaultValue.orderDate).toISOString().split('T')[0] : '',
                receivedDate: defaultValue.receivedDate
                    ? new Date(defaultValue.receivedDate).toISOString().split('T')[0]
                    : ''
            })
        }
    }, [defaultValue])

    const validateField = (name, value) => {
        let error = ''
        if (name === 'supplier' && !value.trim()) {
            error = 'Lieferant ist erforderlich.'
        } else if (name === 'status' && !value) {
            error = 'Status ist erforderlich.'
        } else if (name === 'orderDate' && !value) {
            error = 'Bestelldatum ist erforderlich.'
        } else if (name === 'receivedDate' && !value) {
            error = 'Empfangsdatum ist erforderlich.'
        } else if (name === 'products') {
            value.forEach((product, index) => {
                if (!product.quantity || product.quantity <= 0) {
                    error = `Menge für Produkt ${index + 1} muss positiv sein.`
                }
            })
        }
        return error
    }

    const validateForm = () => {
        const newErrors = {}
        newErrors.supplier = validateField('supplier', formData.supplier)
        newErrors.status = validateField('status', formData.status)
        newErrors.orderDate = validateField('orderDate', formData.orderDate)
        newErrors.receivedDate = validateField('receivedDate', formData.receivedDate)
        newErrors.products = validateField('products', formData.products)

        setErrors(newErrors)
        return Object.values(newErrors).every((err) => !err)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validateField(name, value)
        }))
    }

    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...formData.products]
        updatedProducts[index][field] = field === 'quantity' ? parseInt(value, 10) : value
        setFormData((prev) => ({ ...prev, products: updatedProducts }))
        setErrors((prevErrors) => ({
            ...prevErrors,
            products: validateField('products', updatedProducts)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitError('')
        setSuccessMessage('')

        if (validateForm()) {
            const updatedOrder = {
                ...formData,
                orderDate: formData.orderDate ? new Date(formData.orderDate) : null,
                receivedDate: formData.receivedDate ? new Date(formData.receivedDate) : null
            }

            const result = await onSubmit(updatedOrder)
            if (result.success) {
                setSuccessMessage('Bestellung erfolgreich aktualisiert.')
                setTimeout(() => {
                    setSuccessMessage('')
                    closeModal()
                }, 2000)
            } else {
                setSubmitError(result.message || 'Fehler beim Aktualisieren der Bestellung.')
            }
        } else {
            setSubmitError('Bitte überprüfen Sie die Eingabefelder.')
        }
    }

    if (!defaultValue) return null

    return (
        <div className="modal-container">
            <div className="modal">
                <h2>Bestellung bearbeiten</h2>
                <div className="form-container">
                    <form onSubmit={handleSubmit} noValidate>
                        <h3>Produkte</h3>
                        {formData.products.map((product, index) => (
                            <div key={index} className="product-group">
                                <div className="form-group">
                                    <div className="input-row">
                                        <label>Menge:</label>
                                        <input
                                            type="number"
                                            value={product.quantity}
                                            min="1"
                                            onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {errors.products && <span className="error-message">{errors.products}</span>}

                        <div className="form-group">
                            <div className="input-row">
                                <label>Lieferant:</label>
                                <input
                                    type="text"
                                    name="supplier"
                                    value={formData.supplier}
                                    onChange={handleInputChange}
                                    className={errors.supplier ? 'input-error' : 'form-control'}
                                    required
                                />
                            </div>
                            {errors.supplier && <span className="error-message">{errors.supplier}</span>}
                        </div>

                        <div className="form-group">
                            <div className="input-row">
                                <label>Status:</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className={errors.status ? 'input-error' : 'form-control'}
                                    required
                                >
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
                                <label>Bestelldatum:</label>
                                <input
                                    type="date"
                                    name="orderDate"
                                    value={formData.orderDate}
                                    onChange={handleInputChange}
                                    className={errors.orderDate ? 'input-error' : 'form-control'}
                                    required
                                />
                            </div>
                            {errors.orderDate && <span className="error-message">{errors.orderDate}</span>}
                        </div>

                        <div className="form-group">
                            <div className="input-row">
                                <label>Empfangsdatum:</label>
                                <input
                                    type="date"
                                    name="receivedDate"
                                    value={formData.receivedDate}
                                    onChange={handleInputChange}
                                    className={errors.receivedDate ? 'input-error' : 'form-control'}
                                    required
                                />
                            </div>
                            {errors.receivedDate && <span className="error-message">{errors.receivedDate}</span>}
                        </div>
                        {submitError && <div className="submit-error-message">{submitError}</div>}
                        {successMessage && <div className="success-message">{successMessage}</div>}

                        <div className="button-group">
                            <button type="button" className="cancel-btn" onClick={closeModal}>
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

export default PurchaseEditModal
