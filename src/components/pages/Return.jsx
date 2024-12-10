import React, { useState } from "react";
import "../../styles/Return.css";

export default function Return() {
  const [salesId, setSalesId] = useState("");
  const [products, setProducts] = useState([{ productId: "", quantity: 1, reason: "" }]);
  const [status, setStatus] = useState("Pending");
  const [error, setError] = useState("");

  const addProduct = () => {
    setProducts([...products, { productId: "", quantity: 1, reason: "" }]);
  };

  const removeProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = products.map((product, i) =>
      i === index ? { ...product, [field]: value } : product
    );
    setProducts(updatedProducts);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!salesId || products.some((p) => !p.productId || !p.quantity || !p.reason)) {
      setError("Bitte füllen Sie alle Felder aus.");
      return;
    }

    const returnData = {
      salesId,
      products,
      status,
      createdAt: new Date(),
    };

    try {
      const response = await fetch("https://localhost:3001/api/return/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(returnData),
      });

      if (response.ok) {
        alert("Rückgabe erfolgreich!");
        setSalesId("");
        setProducts([{ productId: "", quantity: 1, reason: "" }]);
        setStatus("Pending");
      } else {
        throw new Error("Fehler bei der Rückgabe");
      }
    } catch (error) {
      setError("Fehler beim Erstellen der Rückgabe.");
    }
  };

  return (
    <div className="return-container">
  <h2 className="return-title">Rückgabeformular</h2>
  <form className="return-form" onSubmit={handleSubmit}>
    <div className="form-group">
      <label className="form-label">Bestell-ID:</label>
      <input
        className="form-input"
        type="text"
        value={salesId}
        onChange={(e) => setSalesId(e.target.value)}
        required
      />
    </div>

    {products.map((product, index) => (
      <div key={index} className="product-section">
        <h3 className="product-title">Produkt {index + 1}</h3>
        <div className="form-group">
          <label className="form-label">Produkt ID:</label>
          <input
            className="form-input"
            type="text"
            value={product.productId}
            onChange={(e) => handleProductChange(index, "productId", e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Rückgabe Menge:</label>
          <input
            className="form-input"
            type="number"
            min="1"
            value={product.quantity}
            onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Grund der Rückgabe:</label>
          <input
            className="form-input"
            type="text"
            value={product.reason}
            onChange={(e) => handleProductChange(index, "reason", e.target.value)}
            required
          />
        </div>
        <button className="remove-product-btn" type="button" onClick={() => removeProduct(index)}>
          Produkt entfernen
        </button>
      </div>
    ))}

    <button className="add-product-btn" type="button" onClick={addProduct}>
      Weitere Produkte hinzufügen
    </button>

    <div className="form-group">
      <label className="form-label">Status:</label>
      <select
        className="form-input"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="Pending">Ausstehend</option>
        <option value="Completed">Abgeschlossen</option>
      </select>
    </div>

    {error && <p className="error-message">{error}</p>}

    <button className="submit-btn" type="submit">Rückgabe abschicken</button>
  </form>
</div>

  );
}
