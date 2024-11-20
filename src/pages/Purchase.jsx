import React, { useState, useEffect } from "react";

import EditModal from "../components/Modal/EditModal.jsx";
import DeleteModal from "../components/Modal/DeleteModal.jsx";
import Pagination from "../components/Pagination.jsx";
import "../styles/Purchase.css";
import PurchaseAddModal from "../components/Modal/PurchaseAddModal.jsx";

const Purchase = () => {
  const [purchases, setPurchases] = useState([]);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const purchasesPerPage = 7;
  const BASE_URL = `https://localhost:3001/api`;

  useEffect(() => {
    const loadPurchases = async () => {
      try {
        const response = await fetch(`${BASE_URL}/purchase/all`);
        if (!response.ok) {
          throw new Error("Error loading purchases");
        }
        const data = await response.json();
        setPurchases(data);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      }
    };
    loadPurchases();
  }, []);

  const handleOpenModal = (type, purchase = null) => {
    if (type === "create") {
      setShowAddModal(true);
    } else if (type === "edit") {
      setSelectedPurchase(purchase);
      setShowEditModal(true);
    } else if (type === "delete") {
      setSelectedPurchase(purchase);
      setShowDeleteModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedPurchase(null);
  };

  const handleAddPurchase = async (purchaseData) => {
    try {
      const response = await fetch(`${BASE_URL}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseData),
      });

      if (!response.ok) {
        throw new Error("Error creating purchase");
      }

      const newPurchase = await response.json();
      setPurchases([...purchases, newPurchase]);
      handleCloseModal();
    } catch (error) {
      console.error("Error adding purchase:", error);
    }
  };

  const handleEditPurchase = async (purchaseData) => {
    try {
      const response = await fetch(`${BASE_URL}/purchase/${purchaseData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseData),
      });

      if (!response.ok) {
        throw new Error("Error updating purchase");
      }

      const updatedPurchase = await response.json();
      setPurchases(
        purchases.map((p) => (p.id === purchaseData.id ? updatedPurchase : p))
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error updating purchase:", error);
    }
  };

  const handleDeletePurchase = async () => {
    if (!selectedPurchase) return;

    try {
      const response = await fetch(
        `${BASE_URL}/purchase/${selectedPurchase.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting purchase");
      }

      setPurchases(purchases.filter((p) => p.id !== selectedPurchase.id));
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting purchase:", error);
    }
  };

  const purchaseFields = [
    {
      name: "products",
      label: "Products",
      type: "text",
      placeholder: "Enter product barcodes and quantities",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["ORDERED", "PENDING", "ARRIVED", "CANCELLED"],
    },
    {
      name: "orderDate",
      label: "Order Date",
      type: "date",
    },
  ];

  const indexOfLastPurchase = currentPage * purchasesPerPage;
  const indexOfFirstPurchase = indexOfLastPurchase - purchasesPerPage;
  const currentPurchases = purchases.slice(
    indexOfFirstPurchase,
    indexOfLastPurchase
  );
  const totalPages = Math.ceil(purchases.length / purchasesPerPage);

  return (
    <div className="purchases-page">
      <div className="purchases-header">
        <h1>Purchases</h1>
        <button
          className="add-purchase-button"
          onClick={() => handleOpenModal("create")}
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>

      <table className="purchase-table">
        <thead>
          <tr>
            <th>Products</th>
            <th>Status</th>
            <th>Order Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPurchases.map((purchase) => (
            <tr key={purchase.id}>
              <td>
                {purchase.products.map((product, index) => (
                  <div key={index}>
                    <span>
                      {product.barcode} (x{product.quantity})
                    </span>
                  </div>
                ))}
              </td>
              <td className="status-cell">
                <span
                  className={`status-button status-${purchase.status.toLowerCase()}`}
                >
                  {purchase.status}
                </span>
              </td>
              <td>{new Date(purchase.orderDate).toLocaleDateString()}</td>
              <td>
                <button
                  onClick={() => handleOpenModal("edit", purchase)}
                  className="icon-button edit-icon"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => handleOpenModal("delete", purchase)}
                  className="icon-button delete-icon"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <button
        className="add-purchase-button"
        onClick={() => handleOpenModal("create")}
      >
        <i className="fas fa-plus"></i>
      </button>

      {showAddModal && (
        <PurchaseAddModal
          isOpen={showAddModal}
          onClose={handleCloseModal}
          onSubmit={handleAddPurchase}
          fields={purchaseFields}
          title="Add New Purchase"
        />
      )}

      {showEditModal && (
        <EditModal
          isOpen={showEditModal}
          onClose={handleCloseModal}
          onSubmit={handleEditPurchase}
          item={selectedPurchase}
          fields={purchaseFields}
          title="Edit Purchase"
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={handleCloseModal}
          onSubmit={handleDeletePurchase}
          itemName="purchase"
        />
      )}
    </div>
  );
};

export default Purchase;
