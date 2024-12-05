import React, { useEffect, useState } from "react";
import "../../styles/Table.css";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";



const InventoryMovement = () => {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('https://localhost:3001/api/inventory/all');
      if (!response.ok) {
        throw new Error("Fehler beim Abrufen der Daten");
      }
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
   
      <><h2>Bestandsbewegungen</h2>
      <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Artikel</th>
            <th>Bewegungsart</th>
            <th>Menge</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{new Date(item.date).toLocaleDateString()}</td>
              <td>{item.productId.name}</td>
              <td>
                {item.type === "Inbound"
                  ? "Wareneingang"
                  : item.type === "Outbound"
                    ? "Warenausgang"
                    : item.type === "Return"
                      ? "Rückgabe"
                      : item.type === "Adjustment"
                        ? "Abschreibung"
                        : item.type}
              </td>
              <td>{item.quantity}</td>
              <td>
                <span className="actions">
                  <BsFillTrashFill
                    className="delete-btn"
                  
                  />
                  <BsFillPencilFill
                    className="edit-btn"
                   
                  />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
     
    </div></>
   
  );
};

export default InventoryMovement;
