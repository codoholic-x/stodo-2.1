import React from 'react';
import './ProductModal.css';

const ProductModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✖</button>

        <img
          src={`http://localhost:5000/uploads/${product.imageUrl}`}
          alt={product.itemName}
          className="modal-image"
        />

        <div className="modal-content">
          <h2>{product.itemName}</h2>
          <p><strong>Price:</strong> ₹{product.price}</p>
          <p><strong>Condition:</strong> {product.condition}</p>
          <p><strong>Location:</strong> {product.location}</p>
          <p><strong>Category:</strong> {product.itemType}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
