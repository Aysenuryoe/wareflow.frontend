import React, { useState, useEffect } from "react";
import Pagination from "./Pagination.jsx";
import "./Sales.css";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const salesPerPage = 7;
  const BASE_URL = `https://localhost:3001/api`;

  // Lade Sales-Daten
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const salesResponse = await fetch(`${BASE_URL}/sales/all`);
        if (!salesResponse.ok) throw new Error("Error fetching sales");
        const salesData = await salesResponse.json();
        setSales(salesData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchSalesData();
  }, []);

  // Berechnung der angezeigten Sales basierend auf der aktuellen Seite
  const indexOfLastSale = currentPage * salesPerPage;
  const indexOfFirstSale = indexOfLastSale - salesPerPage;
  const currentSales = sales.slice(indexOfFirstSale, indexOfLastSale);
  const totalPages = Math.ceil(sales.length / salesPerPage);

  // Fasse alle Produktinformationen in einer Zeile zusammen
  const formatProducts = (products) => {
    return products.map((product) => {
      return `${product.barcode} (Price: $${product.price.toFixed(2)}, Quantity: ${product.quantity})`;
    }).join(', ');
  };

  return (
    <div className="sales-page">
      <div className="sales-header">
        <h1>Sales</h1>
      </div>

      <table className="sales-table">
        <thead>
          <tr>
            <th>Sale Date</th>
            <th>Products</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentSales.map((sale) => {
            const totalAmount = sale.products.reduce(
              (total, product) => total + (product.price * product.quantity),
              0
            );

            return (
              <tr key={sale.id}>
                <td>{new Date(sale.saleDate).toLocaleDateString("en-GB")}</td>
                <td>{formatProducts(sale.products)}</td>
                <td>${totalAmount.toFixed(2)}</td>
                <td>
                                <button
                                >
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Sales;
