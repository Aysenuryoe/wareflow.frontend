import React, { useState, useEffect } from "react";
import AddModal from "../components/Modal/AddModal.jsx";
import EditModal from "../components/Modal/EditModal.jsx";
import DeleteModal from "../components/Modal/DeleteModal.jsx";
import "../styles/Modal.css";
import Pagination from "../components/Pagination.jsx";
import "../styles/Product.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 7;
  const BASE_URL = `https://localhost:3001/api`;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/product/all`);
        if (!response.ok) {
          throw new Error("Error loading products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    loadProducts();
  }, []);

  const handleOpenModal = (type, product = null) => {
    if (type === "create") {
      setShowAddModal(true);
    } else if (type === "edit") {
      setSelectedProduct(product);
      setShowEditModal(true);
    } else if (type === "delete") {
      setSelectedProduct(product);
      setShowDeleteModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };
  const handleAddProduct = async (productData) => {
    try {
      const response = await fetch(`${BASE_URL}/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Error creating product");
      }

      const newProduct = await response.json();
      setProducts([...products, newProduct]);
      handleCloseModal();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleEditProduct = async (productData) => {
    try {
      const response = await fetch(`${BASE_URL}/product/${productData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Error updating product");
      }

      const updatedProduct = await response.json();
      setProducts(
        products.map((p) => (p.id === productData.id ? updatedProduct : p))
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      const response = await fetch(
        `${BASE_URL}/product/${selectedProduct.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting product");
      }

      setProducts(products.filter((p) => p.id !== selectedProduct.id));
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleDeleteSelectedProducts = async () => {
    try {
      await Promise.all(
        selectedProducts.map((id) =>
          fetch(`${BASE_URL}/product/${id}`, { method: "DELETE" })
        )
      );
      setProducts(
        products.filter((product) => !selectedProducts.includes(product.id))
      );
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error deleting selected products:", error);
    }
  };

  const handleSelectAll = (isChecked) => {
    const currentProductIds = currentProducts.map((product) => product.id);
    if (isChecked) {
      setSelectedProducts([
        ...new Set([...selectedProducts, ...currentProductIds]),
      ]);
    } else {
      setSelectedProducts(
        selectedProducts.filter((id) => !currentProductIds.includes(id))
      );
    }
  };

  const handleCheckboxChange = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const productFields = [
    {
      name: "article",
      label: "Article",
      type: "text",
      placeholder: "Enter an article",
      required: true,
    },
    {
      name: "size",
      label: "Size",
      type: "select",
      required: true,
      options: [
        { value: "XS", label: "XS" },
        { value: "S", label: "S" },
        { value: "M", label: "M" },
        { value: "L", label: "L" },
        { value: "XL", label: "XL" },
        { value: "NOSIZE", label: "NO SIZE" },
      ],
    },
    {
      name: "barcode",
      label: "Barcode",
      type: "text",
      placeholder: "Enter the barcode",
      required: true,
    },
    {
      name: "price",
      label: "Price",
      type: "number",
      placeholder: "Enter the price",
      required: true,
    },
    {
      name: "productNum",
      label: "Product number",
      type: "text",
      placeholder: "Enter a product number",
      required: true,
    },
    {
      name: "stock",
      label: "Stock",
      type: "number",
      placeholder: "Enter a stock number",
      required: true
    },
  ];
  

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="products">
      <div className="products__header">
        <h1 className="products__title">Products</h1>
        <button
          className={`products__delete-button ${
            selectedProducts.length === 0 ? "hidden" : ""
          }`}
          onClick={handleDeleteSelectedProducts}
        >
          Delete Selected
        </button>
      </div>

      <table className="products__table">
        <thead className="products__table-header">
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) => handleSelectAll(e.target.checked)}
                checked={
                  currentProducts.every((product) =>
                    selectedProducts.includes(product.id)
                  ) && currentProducts.length > 0
                }
              />
            </th>
            <th>Article</th>
            <th>Size</th>
            <th>Price</th>
            <th>Product Number</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="products__table-body">
          {currentProducts.map((product) => (
            <tr key={product.id} className="products__table-row">
              <td className="products__table-cell">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => handleCheckboxChange(product.id)}
                  className="products__checkbox"
                />
              </td>
              <td className="products__table-cell">{product.article}</td>
              <td className="products__table-cell">{product.size}</td>
              <td className="products__table-cell">{product.price}</td>
              <td className="products__table-cell">{product.productNum}</td>
              <td className="products__table-cell">{product.stock}</td>
              <td className="products__table-cell">
                <div className="products__action-buttons">
                  <button
                    onClick={() => handleOpenModal("edit", product)}
                    className="products__action-button products__action-button--edit"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleOpenModal("delete", product)}
                    className="products__action-button products__action-button--delete"
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
        className="products__pagination"
      />

      <button
        className="products__add-button products__add-button--primary"
        onClick={() => handleOpenModal("create")}
      >
        <i className="fas fa-plus"></i>
      </button>

      {showAddModal && (
        <AddModal
          isOpen={showAddModal}
          onClose={handleCloseModal}
          onSubmit={handleAddProduct}
          fields={productFields}
          title="Add New Product"
        />
      )}

      {showEditModal && (
        <EditModal
          isOpen={showEditModal}
          onClose={handleCloseModal}
          onSubmit={handleEditProduct}
          fields={productFields}
          item={selectedProduct}
          title="Edit Product"
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          isOpen={showDeleteModal}
          onClose={handleCloseModal}
          onSubmit={handleDeleteProduct}
          itemName="product"
        />
      )}
    </div>
  );
};

export default Products;
