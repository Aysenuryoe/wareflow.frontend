import React, { useState, useEffect } from "react";

import PurchaseEditModal from "../components/Modal/PurchaseEditModal.jsx";
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
    console.log("Sende Daten an Server:", purchaseData); 
    try {
      const response = await fetch(`${BASE_URL}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server Error:", errorText);
        throw new Error(`Error creating purchase: ${errorText}`);
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
      name: "orderDate",
      label: "Order Date",
      type: "date",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "Ordered", label: "Ordered" },
        { value: "Pending", label: "Pending" },
        { value: "Arrived", label: "Arrived" },
        { value: "Cancelled", label: "Cancelled" },
      ],
    },
    {
      name: "products",
      label: "Products",
      type: "array", 
      fields: [
        {
          name: "barcode",
          label: "Barcode",
          type: "text",
          readOnly: true,
        },
        {
          name: "quantity",
          label: "Quantity",
          type: "number",
        },
      ],
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
    <div className="purchases">
      <div className="purchases__header">
        <h1 className="purchases__tile">Purchases</h1>
        <button
          className="purchases__add-button purchases__add-button--primary"
          onClick={() => handleOpenModal("create")}
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>

      <table className="purchases__table">
        <thead className="purchases__table-header">
          <tr>
            <th>Products</th>
            <th>Status</th>
            <th>Order Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="purchases__table-body">
          {currentPurchases.map((purchase) => (
            <tr key={purchase.id} className="purchases__table-row">
              <td className="purchases__table-cell">
                {purchase.products.map((product, index) => (
                  <div key={index} className="purchases__products">
                    <span>
                      {product.barcode} (x{product.quantity})
                    </span>
                  </div>
                ))}
              </td>
              <td className="purchases__table-cell">
                <span
                  className={`purchases__status-button purchases__status-button--${purchase.status.toLowerCase()}`}
                >
                  {purchase.status}
                </span>
              </td>
              <td className="purchases__table-cell">{new Date(purchase.orderDate).toLocaleDateString()}</td>
              <td className="purchases__table-cell">
                <div className="purchases__action-buttons">
                  <button
                    onClick={() => handleOpenModal("edit", purchase)}
                    className="purchases__action-button purchases__action-button--edit"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleOpenModal("delete", purchase)}
                    className="purchases__action-button purchases__action-button--delete"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        className="purchases__pagination"
      />

  
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
        <PurchaseEditModal
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
