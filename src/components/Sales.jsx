import React, { useState, useEffect } from "react";
import "./Sales.css";
import SalesAddModal from "./SalesAddModal";

import EditModal from "./EditModal";
import SalesDeleteModal from "./SalesDeleteModal";

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
      const response = await fetch(`${BASE_URL}/sales`,{
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
      
    } 
  };

  const handleEditSale = async (saleData) => {
    try {
      const response = await fetch(`${BASE_URL}/sale/${saleData.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(saleData),
    });

    if (!response.ok) {
        throw new Error("Error updating sale");
    }

    const updatedSale = await response.json();
    setSales(
        sales.map((s) => (s.id === saleData.id ? updatedSale : s))
    );
    handleCloseModal();
    } catch (error) {
      console.error("Error updating sale:", error);
    }

  };


  const handleDeleteSale = async () => {
    if (!selectedSale) return;

    try {
        const response = await fetch(`${BASE_URL}/sale/${selectedSale.id}`, {
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
  { name: "saleDate", label: "Sale Date", type: "date", placeholder: "Select sale date" },
  { name: "source", label: "Source", type: "text", placeholder: "Enter source (e.g. store)", defaultValue: "store", disabled: true },
  { name: "products", label: "Products", type: "select"},
];


  return(

    <div className="sales-page">
      <div className="sales-header">
        <h1>Sales Management</h1>
        <button className="add-sale-button" onClick={() => handleOpenModal("create")}>
          <i className="fas fa-plus">
          </i>
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
       
          {sales.map((sale) => (
            
            <tr key= {sale.id}>
               <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
              <td>
              {sale.products.map((product, index) => (
               
                                    <div key={index}>
                                        <span>{product.barcode} - {product.price} (x{product.quantity})</span>
                                    </div>
                                ))}
              </td>
              <td>30.99$</td>
              <td>
                                <button
                                    onClick={() => handleOpenModal("edit", sale)}
                                    className="icon-button edit-icon"
                                >
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button
                                    onClick={() => handleOpenModal("delete", sale)}
                                    className="icon-button delete-icon"
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </td>
            </tr>
          ))}
        </tbody>
      </table>

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
       {showAddModal && (
        <SalesDeleteModal
          isOpen={showDeleteModal}
          onClose={handleCloseModal}
          onSubmit={handleAddSale}
          fields={saleFields}
          title="Create New Sale"
        />
      )}


    </div>

  
  );
};

export default Sales;
