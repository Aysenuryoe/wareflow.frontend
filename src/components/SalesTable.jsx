import React from "react";
import '../styles/Table.css';
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";

function SalesTable({ rows, deleteRow, editRow }) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Produkt(e)</th>
            <th>Gesamtbetrag</th>
            <th>Verkauft am</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              <td>
                {row.products.map((product, index) => (
                  <div key={index}>
                    <span>{product.productId.name}</span> - {product.quantity} x{" "}
                    {product.price.toFixed(2)} €
                  </div>
                ))}
              </td>
              <td>{row.totalAmount.toFixed(2)} €</td>
              <td>{new Date(row.createdAt).toLocaleDateString()}</td>
              <td>
                <span className="actions">
                  <BsFillTrashFill
                    className="delete-btn"
                    onClick={() => deleteRow(idx)}
                  />
                  <BsFillPencilFill
                    className="edit-btn"
                    onClick={() => editRow(idx)}
                  />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalesTable;
