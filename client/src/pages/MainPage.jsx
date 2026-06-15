// client/src/pages/MainPage.jsx

import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useLocation } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext'; // ✅ Socket import

import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

import './MainPage.css';

const MainPage = () => {
  const { userEmail, userId } = useUser();
  const socket = useSocket(); // ✅ Socket Hook
  const location = useLocation();

  const deletedChatId = location.state?.deletedChatId || null;

  const [userLocation, setUserLocation] = useState('');
  const [products, setProducts] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modalProduct, setModalProduct] = useState(null);
  const [locationAllowed, setLocationAllowed] = useState(true);
  const [chats, setChats] = useState([]);

  const categories = [
    'Notes', 'Previous Question Paper', 'Sport', 'Fitness',
    'Electronic', 'Bags', 'Footwear', 'Home Textiles',
    'Kitchen Appliances', 'Home Decor'
  ];

  // ✅ Fetch user location and nearby products
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = `${position.coords.latitude},${position.coords.longitude}`;
        console.log("📍 Buyer Location being sent:", loc);
        setUserLocation(loc);
        fetchNearbyProducts(loc);
      },
      () => {
        setLocationAllowed(false);
      }
    );
  }, []);

  const fetchNearbyProducts = async (loc) => {
    try {
      const res = await fetch('http://localhost:5000/api/products/nearby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userLocation: loc }),
      });

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('❌ Error fetching nearby products:', err);
    }
  };

  // ✅ Fetch chat list
  useEffect(() => {
    if (userId) {
      fetchChats();
    }
  }, [userId]);

  const fetchChats = async () => {
    const token = localStorage.getItem('token');
    if (!token || !userId) {
      console.warn("⚠️ Missing token or userId");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/chat/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      if (Array.isArray(data.chats)) {
        const filtered = deletedChatId
          ? data.chats.filter(chat => chat._id !== deletedChatId)
          : data.chats;

        setChats(filtered);
      } else {
        console.error("⚠️ Expected chat list to be an array, got:", data);
      }
    } catch (err) {
      console.error('❌ Error fetching chats:', err);
    }
  };

  // ✅ Real-time product removal after Fix Deal from both parties
  useEffect(() => {
    const refreshProducts = async () => {
  const loc = userLocation;
  if (loc) {
    fetchNearbyProducts(loc); // already defined function
  }
};
    if (!socket) return;

    socket.on('product-deleted', (deletedProductId) => {
      console.log("🚮 Product removed via Fix Deal:", deletedProductId);

      setProducts(prev =>
        prev.filter(product => product._id !== deletedProductId)
      );
    });

    return () => socket.off('product-deleted');
  }, [socket]);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    setMenuVisible(false);
  };

  const filteredProducts = products.filter((p) =>
    selectedCategory ? p.itemType.toLowerCase() === selectedCategory.toLowerCase() : true
  );

  return (
    <>
      <Header />

      <div className="main-container">
        {!locationAllowed ? (
          <div className="location-denied">
            <h2>📍 Location access denied</h2>
            <p>Please allow location to view nearby products.</p>
          </div>
        ) : (
          <>
            <div className="menu-bar">
              <button className="menu-toggle" onClick={toggleMenu}>
                {menuVisible ? 'Close Menu ✖️' : 'Product-Items 🍽️'}
              </button>
              {menuVisible && (
                <div className="category-list">
                  {categories.map((cat, index) => (
                    <button key={index} onClick={() => filterByCategory(cat)}>
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="products-grid">
              {filteredProducts.length === 0 ? (
                <p className="no-product-msg">No product available under your location.</p>
              ) : (
                filteredProducts.map((product, index) => (
                  <ProductCard
                    key={index}
                    product={product}
                    currentUserId={userId}
                    onImageClick={() => setModalProduct(product)}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>

      {modalProduct && (
        <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} />
      )}

      <Footer />
    </>
  );
};

export default MainPage;
