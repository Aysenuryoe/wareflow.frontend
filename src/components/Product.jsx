import React, { useState, useEffect } from "react";
import AddModal from "./AddModal";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import "./Modal.css";
import Pagination from "./Pagination.jsx";
import "./Product.css";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 7;
    const BASE_URL = `https://localhost:3001/api`;

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await fetch(`${BASE_URL}/product/all`);
                if (!response.ok) {
                    throw new Error("Error loading products");
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        loadProducts();
    }, []);

    const handleOpenModal = (type, product = null) => {
        if (type === "create") {
            setShowAddModal(true);
        } else if (type === "edit") {
            setSelectedProduct(product);
            setShowEditModal(true);
        } else if (type === "delete") {
            setSelectedProduct(product);
            setShowDeleteModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setSelectedProduct(null);
    };

    const handleAddProduct = async (productData) => {
        try {
            const response = await fetch(`${BASE_URL}/product`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                throw new Error("Error creating product");
            }

            const newProduct = await response.json();
            setProducts([...products, newProduct]);
            handleCloseModal();
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    const handleEditProduct = async (productData) => {
        try {
            const response = await fetch(`${BASE_URL}/product/${productData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                throw new Error("Error updating product");
            }

            const updatedProduct = await response.json();
            setProducts(products.map((p) => (p.id === productData.id ? updatedProduct : p)));
            handleCloseModal();
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;

        try {
            const response = await fetch(`${BASE_URL}/product/${selectedProduct.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Error deleting product");
            }

            setProducts(products.filter((p) => p.id !== selectedProduct.id));
            handleCloseModal();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleDeleteSelectedProducts = async () => {
        try {
            await Promise.all(
                selectedProducts.map((id) =>
                    fetch(`${BASE_URL}/product/${id}`, { method: "DELETE" })
                )
            );
            setProducts(products.filter((product) => !selectedProducts.includes(product.id)));
            setSelectedProducts([]); 
        } catch (error) {
            console.error("Error deleting selected products:", error);
        }
    };

    const handleSelectAll = (isChecked) => {
        const currentProductIds = currentProducts.map((product) => product.id);
        if (isChecked) {
            setSelectedProducts([...new Set([...selectedProducts, ...currentProductIds])]);
        } else {
            setSelectedProducts(selectedProducts.filter((id) => !currentProductIds.includes(id)));
        }
    };

    const handleCheckboxChange = (productId) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts(selectedProducts.filter((id) => id !== productId));
        } else {
            setSelectedProducts([...selectedProducts, productId]);
        }
    };

    const productFields = [
        { name: "article", label: "Article", type: "text", placeholder: "Enter article name" },
        { name: "size", label: "Size", type: "text", placeholder: "Enter size" },
        { name: "barcode", label: "Barcode", type: "text", placeholder: "Enter barcode" },
        { name: "price", label: "Price", type: "number", placeholder: "Enter price" },
        { name: "productNum", label: "Product Number", type: "text", placeholder: "Enter product number" },
        { name: "stock", label: "Stock", type: "number", placeholder: "Enter stock quantity" },
    ];

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    return (
        <div className="products-page">
            <div className="products-header">
                <h1>Products</h1>
                <button
                    className={`delete-selected-button ${selectedProducts.length === 0 ? "hidden" : ""}`}
                    onClick={handleDeleteSelectedProducts}
                >
                    Delete Selected
                </button>
            </div>

            <table className="product-table">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                checked={
                                    currentProducts.every((product) => selectedProducts.includes(product.id)) &&
                                    currentProducts.length > 0
                                }
                            />
                        </th>
                        <th>Article</th>
                        <th>Size</th>
                        <th>Price</th>
                        <th>Product Number</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map((product) => (
                        <tr key={product.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedProducts.includes(product.id)}
                                    onChange={() => handleCheckboxChange(product.id)}
                                />
                            </td>
                            <td>{product.article}</td>
                            <td>{product.size}</td>
                            <td>{product.price}</td>
                            <td>{product.productNum}</td>
                            <td>{product.stock}</td>
                            <td>
                                <button
                                    onClick={() => handleOpenModal("edit", product)}
                                    className="icon-button edit-icon"
                                >
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button
                                    onClick={() => handleOpenModal("delete", product)}
                                    className="icon-button delete-icon"
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            <button className="add-product-button" onClick={() => handleOpenModal("create")}>
                <i className="fas fa-plus"></i>
            </button>

            
            {showAddModal && (
                <AddModal
                    isOpen={showAddModal}
                    onClose={handleCloseModal}
                    onSubmit={handleAddProduct}
                    fields={productFields}
                    title="Add New Product"
                />
            )}

         
            {showEditModal && (
                <EditModal
                    isOpen={showEditModal}
                    onClose={handleCloseModal}
                    onSubmit={handleEditProduct}
                    fields={productFields}
                    item={selectedProduct}
                    title="Edit Product"
                />
            )}

            
            {showDeleteModal && (
                <DeleteModal
                    isOpen={showDeleteModal}
                    onClose={handleCloseModal}
                    onSubmit={handleDeleteProduct}
                    itemName="product"
                />
            )}
        </div>
    );
};

export default Products;
