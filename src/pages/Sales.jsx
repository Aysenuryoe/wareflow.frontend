import React, { useState, useEffect } from "react";
import "../styles/Sales.css";
import SalesAddModal from "../components/Modal/SalesAddModal";
import SaleCard from "../components/SaleCard";
import EditModal from "../components/Modal/EditModal";
import DeleteModal from "../components/Modal/DeleteModal";
import "../styles/Modal.css";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const BASE_URL = `https://localhost:3001/api`;

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/sales/all`);
        if (!response.ok) {
          throw new Error("Error loading purchases");
        }
        const data = await response.json();
        setSales(data);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      }
    };
    fetchSalesData();
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
    } catch (error) {}
  };

  const handleEditSale = async (saleData) => {
    try {
      const response = await fetch(`${BASE_URL}/sales/${saleData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saleData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error updating sale: ${errorText}`);
      }

      const updatedSale = await response.json();
      setSales(sales.map((s) => (s.id === saleData.id ? updatedSale : s)));
      handleCloseModal();
    } catch (error) {
      console.error("Error updating sale:", error);
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

      setSales(sales.filter((p) => p.id !== selectedSale.id));
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
  };

  const saleFields = [
    {
      name: "saleDate",
      label: "Sale Date",
      type: "date",
      placeholder: "Select sale date",
    },
    {
      name: "source",
      label: "Source",
      type: "text",
      placeholder: "Enter source (e.g. store)",
      defaultValue: "store",
      disabled: true,
    },
    { name: "products", label: "Products", type: "select" },
  ];

  const calculateTotalAmount = (products) => {
    return products.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

  const handleEditClick = (sale) => {
    setSelectedSale(sale);
    setShowEditModal(true);
  };

  const handleDeleteClick = (sale) => {
    setSelectedSale(sale);
    setShowDeleteModal(true);
  };

  return (
    <div className="sales">
      <div className="sales__header">
        <h1 className="sales__title">Sales Management</h1>
        <button
          className="sales__add-button sales__add-button--primary"
          onClick={() => handleOpenModal("create")}
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>

      <div className="sales__content">
        <div className="sales__cards">
          {sales.map((sale) => (
            <SaleCard
              key={sale.id}
              sale={sale}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              calculateTotalAmount={calculateTotalAmount}
            />
          ))}
        </div>
      </div>

      {showAddModal && (
        <SalesAddModal
          isOpen={showAddModal}
          onClose={handleCloseModal}
          onSubmit={handleAddSale}
          fields={saleFields}
          title="Create New Sale"
        />
      )}

      {showEditModal && (
        <EditModal
          isOpen={showEditModal}
          onClose={handleCloseModal}
          onSubmit={handleEditSale}
          item={selectedSale}
          title="Edit Sale"
          fields={saleFields}
        />
      )}
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
