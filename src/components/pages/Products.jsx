import React, { useEffect, useState } from 'react'
import AddModal from '../AddModal'
import EditModal from '../EditModal'
import Pagination from '../Pagination'
import { BsFillTrashFill, BsFillPencilFill } from 'react-icons/bs'
import '../../styles/Table.css'
import '../../styles/Products.css'
import DeleteModal from '../DeleteModal'

export default function Products() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setModalOpen] = useState(false)
    const [isEditModalOpen, setEditModalOpen] = useState(false)
    const [currentProduct, setCurrentProduct] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState(null)
    const [successMessage, setSuccessMessage] = useState('')

    const productsPerPage = 7

    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`https://localhost:3001/api/product/all`)
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
                const data = await response.json()
                setProducts(data)
            } catch (err) {
                console.error('Fehler beim Abrufen der Produkte:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const addProduct = async (newProduct) => {
        try {
            const response = await fetch(`https://localhost:3001/api/product`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to add product')
            }

            const savedProduct = await response.json()
            setProducts((prevProducts) => [...prevProducts, savedProduct])

            setSuccessMessage('Produkt erfolgreich erstellt.')

            setTimeout(() => setSuccessMessage(''), 3000)

            return { success: true, product: savedProduct }
        } catch (err) {
            console.error('Failed to add product:', err)
            return { success: false, message: err.message }
        }
    }

    const editProduct = async (updatedProduct) => {
        try {
            const response = await fetch(`https://localhost:3001/api/product/${updatedProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to update product')
            }

            const savedProduct = await response.json()
            setProducts((prevProducts) =>
                prevProducts.map((product) => (product.id === savedProduct.id ? savedProduct : product))
            )

            setSuccessMessage('Produkt erfolgreich aktualisiert.')

            setTimeout(() => setSuccessMessage(''), 3000)

            return { success: true, product: savedProduct }
        } catch (err) {
            console.error('Failed to update product:', err)
            return { success: false, message: err.message }
        }
    }

    const deleteProduct = async (product) => {
        try {
            const response = await fetch(`https://localhost:3001/api/product/${product.id}`, {
                method: 'DELETE'
            })
            if (!response.ok) {
                throw new Error('Failed to delete product')
            }
            setProducts((prevProducts) => prevProducts.filter((p) => p.id !== product.id))
            setDeleteModalOpen(false)
            setProductToDelete(null)
        } catch (err) {
            console.error('Failed to delete product:', err)
            alert(`Fehler beim Löschen des Produkts: ${err.message}`)
        }
    }

    const openAddProductModal = () => {
        setModalOpen(true)
    }

    const openEditProductModal = (productId) => {
        const productToEdit = products.find((product) => product.id === productId)

        if (!productToEdit) {
            console.error('Produkt zum Bearbeiten nicht gefunden')
            return
        }

        setCurrentProduct(productToEdit)
        setEditModalOpen(true)
    }

    const openDeleteProductModal = (productId) => {
        const product = products.find((product) => product.id === productId)
        if (product) {
            setProductToDelete(product)
            setDeleteModalOpen(true)
        } else {
            console.error('Produkt zum Löschen nicht gefunden')
        }
    }

    const saveProduct = async (productData) => {
        const result = await addProduct(productData)
        return result
    }

    const updateProduct = async (productData) => {
        const result = await editProduct(productData)
        return result
    }

    if (loading) {
        return <p className="loading">Lade Produkte...</p>
    }

    return (
        <div className="products-container">
            <div className="products-header">
                <h1 className="products-title">Produkte</h1>
                <button className="add-product-button" onClick={openAddProductModal}>
                    Neues Produkt hinzufügen
                </button>
            </div>

            {successMessage && <p className="success-message">{successMessage}</p>}

            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Größe</th>
                            <th>Preis</th>
                            <th>Farbe</th>
                            <th>Artikelnummer</th>
                            <th>Menge</th>
                            <th>Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((row) => (
                            <tr key={row.id}>
                                <td className="column-name">{row.name}</td>
                                <td className="column-size">{row.size}</td>
                                <td className="column-price">{row.price ? row.price.toFixed(2) : '-'}</td>
                                <td className="column-color">{row.color}</td>
                                <td className="column-sku">{row.sku}</td>
                                <td className="column-stock">{row.stock}</td>
                                <td className="column-actions">
                                    <span className="actions">
                                        <BsFillPencilFill
                                            className="edit-btn"
                                            onClick={() => openEditProductModal(row.id)}
                                        />
                                        <BsFillTrashFill
                                            className="delete-btn"
                                            onClick={() => openDeleteProductModal(row.id)}
                                        />
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                className="products-pagination"
                totalItems={products.length}
                itemsPerPage={productsPerPage}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
            />

            {isModalOpen && <AddModal closeModal={() => setModalOpen(false)} onSubmit={saveProduct} />}

            {isEditModalOpen && currentProduct && (
                <EditModal
                    closeModal={() => {
                        setEditModalOpen(false)
                        setCurrentProduct(null)
                    }}
                    onSubmit={updateProduct}
                    defaultValue={currentProduct}
                />
            )}

            {isDeleteModalOpen && productToDelete && (
                <DeleteModal
                    closeModal={() => {
                        setDeleteModalOpen(false)
                        setProductToDelete(null)
                    }}
                    onConfirm={() => deleteProduct(productToDelete)}
                    productName={productToDelete.name}
                />
            )}
        </div>
    )
}
