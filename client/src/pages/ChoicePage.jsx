// client/src/pages/ChoicePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChoicePage.css';

const ChoicePage = () => {
  const [selected, setSelected] = useState('');
  const navigate = useNavigate();

  const handleVisit = () => {
    if (selected === 'buyer') {
      navigate('/main-page');
    } else if (selected === 'seller') {
      navigate('/upload-product');
    } else {
      alert('Please select one option.');
    }
  };

  return (
    <div className="choice-container">
      <h1 className="title">Welcome to the STODO</h1>

      <div className="note-box">
        <strong>Note:</strong>
        <p>
          This website is designed for students to buy/sell their remaining items like books, notes, mattresses, kitchen items etc. after college.
        </p>
      </div>

      <h2 className="choose-heading">Choose your destination point</h2>

      <div className="options">
        <button
          className={`option-btn ${selected === 'buyer' ? 'selected' : ''}`}
          onClick={() => setSelected('buyer')}
        >
          As A Buyer Visit
        </button>
        <button
          className={`option-btn ${selected === 'seller' ? 'selected' : ''}`}
          onClick={() => setSelected('seller')}
        >
          As A Seller Visit
        </button>
      </div>

      <button className="visit-btn" onClick={handleVisit}>
        Visit
      </button>
    </div>
  );
};

export default ChoicePage;
