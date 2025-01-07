import React, { useState, useEffect } from 'react'
import '../styles/Modal.css'

const AddModal = ({ closeModal, onSubmit, defaultValue }) => {
    const [product, setProduct] = useState({
        name: '',
        size: '',
        price: '',
        color: '',
        stock: '',
        description: ''
    })

    const [errors, setErrors] = useState({
        name: '',
        size: '',
        price: '',
        color: '',
        stock: '',
        description: ''
    })

    const [successMessage, setSuccessMessage] = useState('')
    const [submitError, setSubmitError] = useState('')

    useEffect(() => {
        if (defaultValue) {
            setProduct({ ...defaultValue })
        }
    }, [defaultValue])

    const validateField = (name, value) => {
        let error = ''
        const lettersAndSpacesRegex = /^[A-Za-z\s-.]+$/
        const lettersOnlyRegex = /^[A-Za-z]+$/

        switch (name) {
            case 'name':
                if (!value.trim()) {
                    error = 'Name ist erforderlich.'
                } else if (!lettersAndSpacesRegex.test(value)) {
                    error = 'Name darf nur Buchstaben und Leerzeichen enthalten.'
                } else if (value.length > 100) {
                    error = 'Name darf maximal 100 Zeichen lang sein.'
                }
                break

            case 'size':
                if (!value) {
                    error = 'Größe ist erforderlich.'
                }
                break

            case 'price':
                if (value === '') {
                    error = 'Preis ist erforderlich.'
                } else if (isNaN(value) || Number(value) < 0) {
                    error = 'Preis muss eine positive Zahl sein.'
                }
                break

            case 'color':
                if (!value.trim()) {
                    error = 'Farbe ist erforderlich.'
                } else if (!lettersOnlyRegex.test(value)) {
                    error = 'Farbe darf nur Buchstaben enthalten.'
                } else if (value.length > 50) {
                    error = 'Farbe darf maximal 50 Zeichen lang sein.'
                }
                break

            case 'stock':
                if (value === '') {
                    error = 'Lagerbestand ist erforderlich.'
                } else if (!Number.isInteger(Number(value)) || Number(value) < 0) {
                    error = 'Lagerbestand muss eine nicht-negative ganze Zahl sein.'
                }
                break

            case 'description':
                if (value && !lettersAndSpacesRegex.test(value)) {
                    error = 'Beschreibung darf nur Buchstaben und Leerzeichen enthalten.'
                } else if (value.length > 500) {
                    error = 'Beschreibung darf maximal 500 Zeichen lang sein.'
                }
                break

            default:
                break
        }

        return error
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: name === 'price' || name === 'stock' ? value : value
        }))

        const error = validateField(name, value)
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error
        }))
    }

    const validateForm = () => {
        const newErrors = {}

        Object.keys(product).forEach((field) => {
            if (field !== 'description') {
                const error = validateField(field, product[field])
                if (error) {
                    newErrors[field] = error
                }
            } else {
                const error = validateField(field, product[field])
                if (error) {
                    newErrors[field] = error
                }
            }
        })

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setSubmitError('')
        setSuccessMessage('')

        if (validateForm()) {
            const formattedProduct = {
                ...product,
                price: parseFloat(product.price),
                stock: parseInt(product.stock, 10)
            }
            const result = await onSubmit(formattedProduct)
            if (result.success) {
                setSuccessMessage('Produkt erfolgreich erstellt.')

                setProduct({
                    name: '',
                    size: '',
                    price: '',
                    color: '',
                    stock: '',
                    description: ''
                })

                setTimeout(() => {
                    closeModal()
                }, 2000)
            } else {
                setSubmitError(result.message || 'Fehler beim Erstellen des Produkts.')
            }
        }
    }

    return (
        <div className="modal-container">
            <div className="modal">
                <h2>{defaultValue ? 'Produkt bearbeiten' : 'Neues Produkt erstellen'}</h2>
                <div className="form-container">
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="form-group">
                            <div className="input-row">
                                <label htmlFor="name">Name:</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={product.name}
                                    onChange={handleChange}
                                    className={errors.name ? 'input-error' : ''}
                                />
                            </div>
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <div className="input-row">
                                <label htmlFor="size">Größe:</label>
                                <select
                                    id="size"
                                    name="size"
                                    value={product.size}
                                    onChange={handleChange}
                                    className={errors.size ? 'input-error' : ''}
                                >
                                    <option value="">Bitte wählen</option>
                                    <optgroup label="Kleidung">
                                        <option value="XS">XS</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                    </optgroup>
                                    <optgroup label="Schuhe">
                                        <option value="37">37</option>
                                        <option value="38">38</option>
                                        <option value="39">39</option>
                                        <option value="40">40</option>
                                        <option value="41">41</option>
                                        <option value="42">42</option>
                                        <option value="43">43</option>
                                        <option value="44">44</option>
                                    </optgroup>
                                    <option value="NOSIZE">NOSIZE</option>
                                </select>
                            </div>
                            {errors.size && <span className="error-message">{errors.size}</span>}
                        </div>

                        <div className="form-group">
                            <div className="input-row">
                                <label htmlFor="price">Preis:</label>
                                <input
                                    id="price"
                                    type="number"
                                    name="price"
                                    value={product.price}
                                    onChange={handleChange}
                                    className={errors.price ? 'input-error' : ''}
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                            {errors.price && <span className="error-message">{errors.price}</span>}
                        </div>

                        <div className="form-group">
                            <div className="input-row">
                                <label htmlFor="color">Farbe:</label>
                                <input
                                    id="color"
                                    type="text"
                                    name="color"
                                    value={product.color}
                                    onChange={handleChange}
                                    className={errors.color ? 'input-error' : ''}
                                />
                            </div>
                            {errors.color && <span className="error-message">{errors.color}</span>}
                        </div>

                        <div className="form-group">
                            <div className="input-row">
                                <label htmlFor="stock">Lagerbestand:</label>
                                <input
                                    id="stock"
                                    type="number"
                                    name="stock"
                                    value={product.stock}
                                    onChange={handleChange}
                                    className={errors.stock ? 'input-error' : ''}
                                    min="0"
                                />
                            </div>
                            {errors.stock && <span className="error-message">{errors.stock}</span>}
                        </div>

                        <div className="form-group">
                            <div className="input-row">
                                <label htmlFor="description">Beschreibung:</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={product.description}
                                    onChange={handleChange}
                                    className={errors.description ? 'input-error' : ''}
                                    maxLength="500"
                                />
                            </div>
                            {errors.description && <span className="error-message">{errors.description}</span>}
                        </div>

                        {submitError && <div className="submit-error-message">{submitError}</div>}

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

export default AddModal
