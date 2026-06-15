import React, { useState } from 'react';
import './ProductCard.css';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onImageClick, currentUserId }) => {
  const [showMore, setShowMore] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // ✅ state for confirmation
  const navigate = useNavigate();

  const shortCondition = product.condition.length > 35
    ? `${product.condition.substring(0, 35)}...`
    : product.condition;

  const handleBuyClick = () => {
    if (currentUserId === product.seller._id) {
      alert("⚠️ You can't buy your own product.");
      return;
    }

    // ✅ Show confirmation popup
    setShowConfirm(true);
  };

  const handleBuyConfirmed = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!token || !user) {
      alert('Please login first');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/chat/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          buyerId: user._id,
          sellerId: product.seller._id,
          productId: product._id
        })
      });

      const data = await res.json();
      if (res.ok) {
        navigate(`/chat/${data.chatId}`);
      } else {
        alert('Unable to start chat — ' + data.message);
      }
    } catch (err) {
      alert('Unable to start chat — try again');
      console.error(err);
    }
  };

  return (
    <>
      <div className="product-card">
        <img
          src={`http://localhost:5000/uploads/${product.imageUrl}`}
          alt={product.itemName}
          className="product-image"
          onClick={onImageClick}
        />

        <div className="product-details">
          <h3 className="product-name">{product.itemName}</h3>

          <p className="product-condition">
            {showMore ? product.condition : shortCondition}
            {product.condition.length > 35 && (
              <span
                className="more-less"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? ' Less' : ' More'}
              </span>
            )}
          </p>

          <div className="product-footer">
            <span className="product-price">₹{product.price}</span>
            <button className="buy-btn" onClick={handleBuyClick}>Buy</button>
          </div>
        </div>
      </div>

      {/* ✅ Confirmation Popup Modal */}
      {showConfirm && (
        <div className="buy-confirm-popup">
          <div className="popup-box">
            <p>🛒 Are you sure you want to buy this product?</p>
            <div className="popup-actions">
              <button onClick={handleBuyConfirmed} className="yes-btn">Yes</button>
              <button onClick={() => setShowConfirm(false)} className="no-btn">No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
