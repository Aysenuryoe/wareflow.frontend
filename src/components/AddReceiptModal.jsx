import React, { useState, useEffect } from 'react'
import '../styles/Modal.css'

function AddReceiptModal({ isOpen, onClose, onAdd, initialData = null }) {
    const [purchaseOrders, setPurchaseOrders] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [formData, setFormData] = useState({
        purchaseOrderId: '',
        receivedDate: '',
        status: 'Pending',
        remarks: '',
        products: []
    })

    const [loadingOrders, setLoadingOrders] = useState(true)
    const [loadingProducts, setLoadingProducts] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchProducts() {
            try {
                const resp = await fetch('https://localhost:3001/api/product/all')
                if (!resp.ok) {
                    throw new Error(`Failed to fetch products. Status: ${resp.status}`)
                }
                const data = await resp.json()
                setAllProducts(data)
            } catch (err) {
                setError(err.message)
            }
        }

        if (isOpen) {
            fetchProducts()
        }
    }, [isOpen])

    useEffect(() => {
        if (initialData) {
            setFormData({
                purchaseOrderId: initialData.purchaseOrderId || '',
                receivedDate: initialData.receivedDate || '',
                status: initialData.status || 'Pending',
                remarks: initialData.remarks || '',
                products:
                    initialData.products.map((product) => ({
                        productId: product.productId,
                        name: product.name,
                        size: product.size || '',
                        orderedQuantity: product.orderedQuantity,
                        receivedQuantity: product.receivedQuantity || 0,
                        discrepancies: product.discrepancies || '',

                        productInfo: product.name
                            ? `${product.name} ${product.size ? `(Größe: ${product.size})` : ''}`
                            : ''
                    })) || []
            })
        }
    }, [initialData])

    useEffect(() => {
        async function fetchPurchaseOrders() {
            setLoadingOrders(true)
            try {
                const response = await fetch('https://localhost:3001/api/purchase/all')
                if (!response.ok) {
                    throw new Error(`Failed to fetch purchase orders. Status: ${response.status}`)
                }
                const data = await response.json()
                setPurchaseOrders(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoadingOrders(false)
            }
        }

        if (isOpen) {
            fetchPurchaseOrders()
        }
    }, [isOpen])

    useEffect(() => {
        async function fetchPurchaseOrderDetails(purchaseOrderId) {
            setLoadingProducts(true)
            try {
                const response = await fetch(`https://localhost:3001/api/purchase/${purchaseOrderId}`)
                if (!response.ok) {
                    throw new Error(`Failed to fetch purchase order details. Status: ${response.status}`)
                }
                const data = await response.json()

                const newProducts = data.products.map((p) => {
                    const found = allProducts.find((ap) => ap.id === p.productId)
                    let combinedInfo = 'Unbekannt'
                    if (found) {
                        combinedInfo = found.name
                        if (found.size) {
                            combinedInfo += ` (Größe: ${found.size})`
                        }
                    }

                    return {
                        productId: p.productId,
                        name: found?.name || p.name || '',
                        size: found?.size || p.size || '',
                        orderedQuantity: p.quantity,
                        receivedQuantity: 0,
                        discrepancies: '',
                        productInfo: combinedInfo
                    }
                })

                setFormData((prevState) => ({
                    ...prevState,
                    purchaseOrderId: purchaseOrderId,
                    products: newProducts
                }))
            } catch (err) {
                setError(err.message)
            } finally {
                setLoadingProducts(false)
            }
        }

        if (formData.purchaseOrderId && !initialData) {
            fetchPurchaseOrderDetails(formData.purchaseOrderId)
        }
    }, [formData.purchaseOrderId, initialData, allProducts])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleProductChange = (index, e) => {
        const { name, value } = e.target
        const updatedProducts = [...formData.products]
        if (name === 'receivedQuantity' || name === 'orderedQuantity') {
            updatedProducts[index][name] = parseInt(value, 10)
        } else {
            updatedProducts[index][name] = value
        }
        setFormData({ ...formData, products: updatedProducts })
    }
    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.purchaseOrderId || !formData.receivedDate) {
            alert('Bitte alle Pflichtfelder ausfüllen.')
            return
        }

        for (let product of formData.products) {
            if (!product.name || !product.size || product.receivedQuantity == null || product.receivedQuantity < 0) {
                alert('Bitte geben Sie einen gültigen Produktnamen, Größe und erhaltene Menge an.')
                return
            }
        }

        onAdd(formData)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="modal-container">
            <div className="modal">
                <h2 id="add-modal-title">Wareneingang hinzufügen</h2>
                {loadingOrders ? (
                    <div>Wareneinkäufe werden geladen...</div>
                ) : error ? (
                    <div className="error">Error: {error}</div>
                ) : (
                    <div className="form-container">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <div className="input-row">
                                    <label>Warenbestellung:</label>
                                    <select
                                        name="purchaseOrderId"
                                        value={formData.purchaseOrderId}
                                        onChange={handleInputChange}
                                        required
                                        disabled={!!initialData}
                                    >
                                        <option value="">Auswählen</option>
                                        {purchaseOrders.map((po, index) => (
                                            <option key={po.id} value={po.id}>
                                                {`Nummer ${index + 1} - Lieferant: ${po.supplier}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-row">
                                    <label>Empfangsdatum:</label>
                                    <input
                                        type="date"
                                        name="receivedDate"
                                        value={formData.receivedDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-row">
                                    <label>Status:</label>
                                    <select name="status" value={formData.status} onChange={handleInputChange}>
                                        <option value="Pending">Ausstehend</option>
                                        <option value="Completed">Vollendet</option>
                                        <option value="Partial">Teilweise</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-row">
                                    <label>Bemerkung:</label>
                                    <textarea
                                        name="remarks"
                                        value={formData.remarks}
                                        onChange={handleInputChange}
                                        placeholder="Bemerkungen hinzufügen..."
                                    ></textarea>
                                </div>
                            </div>

                            {loadingProducts ? (
                                <div>Produkte werden geladen...</div>
                            ) : (
                                <>
                                    {formData.products.length > 0 &&
                                        formData.products.map((product, index) => (
                                            <div key={index} className="product-container">
                                                <div className="form-group">
                                                    <div className="input-row">
                                                        <label>Produkt:</label>
                                                        <input
                                                            type="text"
                                                            name="productInfo"
                                                            value={
                                                                product.productInfo
                                                                    ? product.productInfo
                                                                    : `${product.name} ${
                                                                          product.size ? `(Größe: ${product.size})` : ''
                                                                      }`
                                                            }
                                                            disabled
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <div className="input-row">
                                                        <label>Bestellte Menge:</label>
                                                        <input
                                                            type="number"
                                                            name="orderedQuantity"
                                                            value={product.orderedQuantity}
                                                            onChange={(e) => handleProductChange(index, e)}
                                                            min="0"
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="input-row">
                                                        <label>Erhaltene Menge:</label>
                                                        <input
                                                            type="number"
                                                            name="receivedQuantity"
                                                            value={product.receivedQuantity}
                                                            onChange={(e) => handleProductChange(index, e)}
                                                            required
                                                            min="0"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="input-row">
                                                        <label>Differenzen:</label>
                                                        <input
                                                            type="text"
                                                            name="discrepancies"
                                                            value={product.discrepancies}
                                                            onChange={(e) => handleProductChange(index, e)}
                                                            placeholder="z.B. 2 fehlend"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </>
                            )}

                            <div className="button-group">
                                <button type="button" className="cancel-btn" onClick={onClose}>
                                    Abbrechen
                                </button>
                                <button type="submit" className="submit-btn">
                                    {initialData ? 'Aktualisieren' : 'Hinzufügen'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AddReceiptModal
