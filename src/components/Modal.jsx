import React, { useState, useEffect } from 'react';
import "../styles/Modal.css";

const Modal = ({ closeModal, onSubmit, defaultValue }) => {
  const [product, setProduct] = useState({
    name: '',
    size: '',
    price: 0,
    color: '',
    stock: 0,
    description: '',
  });

  useEffect(() => {
    if (defaultValue) {
      console.log('defaultValue im useEffect:', defaultValue);
      setProduct({ ...defaultValue }); 
    }
  }, [defaultValue]);

  useEffect(() => {
    console.log('Produkt nach setProduct:', product);
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => {
      const updatedProduct = {
        ...prevProduct,
        [name]: ['price', 'stock'].includes(name) ? Number(value) : value,
      };
      console.log('Produkt nach handleChange:', updatedProduct);
      return updatedProduct;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Produkt beim Absenden im handleSubmit:', product);
    onSubmit(product);
  };

  return (
    <div className="modal-container">
      <div className="modal">
        <h2>{defaultValue ? 'Produkt bearbeiten' : 'Neues Produkt erstellen'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              id="name"
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Größe:</label>
            <select
              id="size"
              name="size"
              value={product.size}
              onChange={handleChange}
            >
              <option value="">Bitte wählen</option>
              <optgroup label="Kleidung">
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </optgroup>
              <optgroup label="Schuhe">
                <option value="37">37</option>
                <option value="38">38</option>
                <option value="39">39</option>
                <option value="40">40</option>
                <option value="41">41</option>
                <option value="42">42</option>
                <option value="43">43</option>
                <option value="44">44</option>
              </optgroup>
              <option value="NOSIZE">NOSIZE</option>
            </select>
          </div>

          <div className="form-group">
            <label>Preis:</label>
            <input
              id="price"
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Farbe:</label>
            <input
              id="color"
              type="text"
              name="color"
              value={product.color}
              onChange={handleChange}
            />
          </div>


          <div className="form-group">
            <label>Lagerbestand:</label>
            <input
              id="stock"
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
            />
          </div>

       
          <div className="form-group">
            <label>Beschreibung:</label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
            />
          </div>

      
          <div className="button-group">
          <button type="button" onClick={closeModal} className="cancel-btn">
              Abbrechen
            </button>
            <button type="submit" className="submit-btn">
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
