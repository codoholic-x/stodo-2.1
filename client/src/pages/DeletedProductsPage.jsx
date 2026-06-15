// client/src/pages/DeletedProductsPage.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { useSocket } from '../contexts/SocketContext';
import './DeletedProductsPage.css';

const DeletedProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [confirmId, setConfirmId] = useState(null);

  const { userId } = useUser();
  const socket = useSocket();

  // ✅ Fetch all uploaded products of this seller
  useEffect(() => {
    if (!userId) return;

    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/profile/my-products/${userId}`
        );
        setProducts(res.data.products);
      } catch (err) {
        console.error("❌ Failed to fetch products", err);
      }
    };

    fetchProducts();
  }, [userId]);

  // ✅ Seller deletes product
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/profile/delete/${productId}`);

      // Frontend se remove karo
      setProducts(prev => prev.filter(p => p._id !== productId));

      // Real-time event send → MainPage me product remove ho jayega
      socket.emit("product-deleted", productId);

      setConfirmId(null);
    } catch (err) {
      console.error("❌ Deletion failed", err);
    }
  };

  return (
    <div className="deleted-products-container">
      <h2>🗑️ Your Uploaded Products</h2>

      {products.length === 0 ? (
        <p className="no-items">You have not uploaded any products.</p>
      ) : (
        products.map(product => (
          <div key={product._id} className="delete-product-card">
            
            {/* 🖼️ Image */}
            <img
              src={`http://localhost:5000/${product.image}`}
              alt={product.itemName}
              className="delete-product-img"
            />

            {/* 📌 Product Info */}
            <div className="delete-product-info">
              <h3>{product.itemName}</h3>
              <p><strong>Type:</strong> {product.itemType}</p>
              <p><strong>Price:</strong> ₹{product.price}</p>
              <p><strong>Condition:</strong> {product.condition}</p>
            </div>

            {/* ❌ Delete Button */}
            <button
              className="delete-btn"
              onClick={() => setConfirmId(product._id)}
            >
              Delete
            </button>

            {/* ⚠️ Confirmation Box */}
            {confirmId === product._id && (
              <div className="confirm-popup">
                <p>Are you sure you want to delete this item?</p>

                <button
                  className="yes-btn"
                  onClick={() => handleDelete(product._id)}
                >
                  Yes
                </button>

                <button
                  className="no-btn"
                  onClick={() => setConfirmId(null)}
                >
                  No
                </button>
              </div>
            )}

          </div>
        ))
      )}
    </div>
  );
};

export default DeletedProductsPage;
