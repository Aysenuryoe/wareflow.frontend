import React, { useState, useEffect } from 'react'
import '../styles/Modal.css'

function AddReceiptModal({ isOpen, onClose, onAdd, initialData = null }) {
    const [purchaseOrders, setPurchaseOrders] = useState([])
    const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null)
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
        if (initialData) {
            setFormData({
                purchaseOrderId: initialData.purchaseOrderId || '',
                receivedDate: initialData.receivedDate || '',
                status: initialData.status || 'Pending',
                remarks: initialData.remarks || '',
                products: initialData.products || []
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
                setSelectedPurchaseOrder(data)
                setFormData((prevState) => ({
                    ...prevState,
                    purchaseOrderId: purchaseOrderId,
                    products: data.products.map((product) => ({
                        productId: product.productId,
                        name: product.name,
                        orderedQuantity: product.quantity,
                        receivedQuantity: 0,
                        discrepancies: ''
                    }))
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
    }, [formData.purchaseOrderId, initialData])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleProductChange = (index, e) => {
        const { name, value } = e.target
        const updatedProducts = [...formData.products]
        updatedProducts[index][name] = name === 'receivedQuantity' ? parseInt(value, 10) : value
        setFormData({ ...formData, products: updatedProducts })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Basic validation
        if (!formData.purchaseOrderId || !formData.receivedDate) {
            alert('Bitte alle Pflichtfelder ausfüllen.')
            return
        }

        onAdd(formData)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="modal-container">
            <div className="modal">
                <h2>{initialData ? 'Edit Goods Receipt' : 'Wareneingang hinzufügen'}</h2>
                {loadingOrders ? (
                    <div>Wareneinkäufe werden geladen...</div>
                ) : error ? (
                    <div>Error: {error}</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Warenbestellung:</label>
                            <select
                                name="purchaseOrderId"
                                value={formData.purchaseOrderId}
                                onChange={handleInputChange}
                                required
                                disabled={!!initialData}
                            >
                                <option value="Select">Wareneinkauf auswählen</option>
                                {purchaseOrders.map((po, index) => (
                                    <option key={po.id} value={po.id}>
                                        {`Nummer ${index + 1}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Empfangsdatum:</label>
                            <input
                                type="date"
                                name="receivedDate"
                                value={formData.receivedDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Status:</label>
                            <select name="status" value={formData.status} onChange={handleInputChange}>
                                <option value="Pending">Austehend</option>
                                <option value="Completed">Vollendet</option>
                                <option value="Partial">Teilweise</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Bemerkung:</label>
                            <textarea name="remarks" value={formData.remarks} onChange={handleInputChange}></textarea>
                        </div>

                        {loadingProducts ? (
                            <div>Produkte werden geladen...</div>
                        ) : (
                            <>
                                <h3>Products</h3>
                                {formData.products.map((product, index) => (
                                    <div key={index} className="form-group">
                                        <p>
                                            <strong>Produkt:</strong> {product.name}
                                        </p>
                                        <p>
                                            <strong>Bestellte Menge:</strong> {product.orderedQuantity}
                                        </p>
                                        <div>
                                            <label>Erhaltene Menge:</label>
                                            <input
                                                type="number"
                                                name="receivedQuantity"
                                                value={product.receivedQuantity}
                                                onChange={(e) => handleProductChange(index, e)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label>Differenzen:</label>
                                            <input
                                                type="text"
                                                name="discrepancies"
                                                value={product.discrepancies}
                                                onChange={(e) => handleProductChange(index, e)}
                                            />
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
                                {initialData ? 'Update' : 'Submit'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default AddReceiptModal
