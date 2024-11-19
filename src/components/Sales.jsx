import React, { useState, useEffect } from "react";
import SalesAddModal from "./SalesAddModal";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import "./Sales.css";

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [selectedSale, setSelectedSale] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const BASE_URL = `https://localhost:3001/api`;

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await fetch(`${BASE_URL}/sales/all`);
                if (!response.ok) {
                    throw new Error("Error loading sales");
                }
                const data = await response.json();
                setSales(data);
            } catch (error) {
                console.error("Error fetching sales:", error);
            }
        };
        fetchSales();
    }, []);

    const handleOpenModal = (type, sale = null) => {
        if (type === "create") {
            setShowAddModal(true);
        } else if (type === "edit") {
            setSelectedSale(sale);
            setShowEditModal(true);
        } else if (type === "delete") {
            setSelectedSale(sale);
            setShowDeleteModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setSelectedSale(null);
    };

    const handleAddSale = async (saleData) => {
        try {
            const response = await fetch(`${BASE_URL}/sales`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(saleData),
            });

            if (!response.ok) {
                throw new Error("Error creating sale");
            }

            const newSale = await response.json();
            setSales([...sales, newSale]);
            handleCloseModal();
        } catch (error) {
            console.error("Error adding sale:", error);
        }
    };


    const handleDeleteSale = async () => {
        if (!selectedSale) return;

        try {
            const response = await fetch(`${BASE_URL}/sales/${selectedSale.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Error deleting sale");
            }

            setSales(sales.filter((sale) => sale.id !== selectedSale.id));
            handleCloseModal();
        } catch (error) {
            console.error("Error deleting sale:", error);
        }
    };

    return (
        <div className="sales-page">
            <div className="sales-header">
                <h1>Sales</h1>
                <button
                    className="add-sale-button"
                    onClick={() => handleOpenModal("create")}
                >
                    <i className="fas fa-plus"></i>
                </button>
            </div>

            <table className="sales-table">
                <thead>
                    <tr>
                        <th>Sale Date</th>
                        <th>Products</th>
                        <th>Total Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.length > 0 ? (
                        sales.map((sale) => (
                            <tr key={sale.id}>
                                <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
                                <td>
                                    {sale.products.map((product, idx) => (
                                        <div key={idx}>
                                            {product.barcode} - ${product.price?.toFixed(2)} x {product.quantity}
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    $
                                    {sale.products
                                        .reduce(
                                            (total, product) =>
                                                total + (product.price || 0) * (product.quantity || 0),
                                            0
                                        )
                                        .toFixed(2)}
                                </td>
                                <td>
                                    <button
                                        className="icon-button edit-icon"
                                        onClick={() => handleOpenModal("edit", sale)}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        className="icon-button delete-icon"
                                        onClick={() => handleOpenModal("delete", sale)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="no-data">
                                No sales available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Add Modal */}
            {showAddModal && (
                <SalesAddModal
                    isOpen={showAddModal}
                    onClose={handleCloseModal}
                    onSubmit={handleAddSale}
                    fields={[
                        { name: "saleDate", label: "Sale Date", type: "date" },
                        { name: "products", label: "Products", type: "text", placeholder: "Enter product details" },
                    ]}
                    title="Add New Sale"
                />
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <DeleteModal
                    isOpen={showDeleteModal}
                    onClose={handleCloseModal}
                    onSubmit={handleDeleteSale}
                    itemName="sale"
                />
            )}
        </div>   
    );
};

export default Sales;
