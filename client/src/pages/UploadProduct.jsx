import React, { useEffect, useState } from 'react';
import './UploadProduct.css';
import { useNavigate } from 'react-router-dom';

const UploadProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    itemType: '',
    itemName: '',
    price: '',
    image: null,
    condition: '',
  });

  const [location, setLocation] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [locationDenied, setLocationDenied] = useState(false);

  // ✅ Get proper formatted location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = pos.coords;
        setLocation(`${coords.latitude},${coords.longitude}`); // ✅ CORRECT FORMAT
      },
      () => {
        setLocationDenied(true);
      }
    );
  }, []);

  // Handle Form Input Changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files[0];
      if (file && file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Max 2MB image allowed' });
        return;
      } else {
        setErrors({ ...errors, image: '' });
        setForm({ ...form, image: file });
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!form.itemType) newErrors.itemType = 'Item type is required';
    if (!form.itemName) newErrors.itemName = 'Item name is required';
    if (!form.price || form.price < 10 || form.price > 2000) {
      newErrors.price = 'Price must be between ₹10 and ₹2000';
    }
    if (!form.image) newErrors.image = 'Image is required';
    if ((form.condition || '').split(' ').length > 25) {
      newErrors.condition = 'Max 25 words allowed';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      alert('Please allow location access to continue');
      return;
    }

    if (!validate()) return;

    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    data.append('location', location); // ✅ Proper location format

     // ✅ Add seller ID from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user._id) {
    alert('User not logged in!');
    return;
  }
  data.append('seller', user._id); // ✅

    try {
      const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/products/upload`, {
        method: 'POST',
        headers: {
          'x-user-id': user._id, // ✅ very important
        },
        body: data,
      });

      const json = await res.json();
      if (res.ok) {
        alert('Product Uploaded!');
        navigate('/main-page');
      } else {
        alert(json.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading product');
    }
  };

  const ITEM_OPTIONS = [
    'Book', 'Handwritten Notes', 'Previous Question Paper', 'Sport',
    'Fitness', 'Electronic', 'Bags', 'Footwear', 'Home Textiles',
    'Kitchen Appliances', 'Home Decor'
  ];

  return (
    <div className="upload-wrapper">
      <header className="upload-header">
        <div className="logo">STODO</div>
        <div className="title">Welcome Seller</div>
      </header>

      <form className="upload-box" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Item Type:</label>
          <select name="itemType" value={form.itemType} onChange={handleChange} required>
            <option value="">-- Select Item Type --</option>
            {ITEM_OPTIONS.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
          <small className="error">{errors.itemType}</small>
        </div>

        <div className="form-group">
          <label>Item Name:</label>
          <input type="text" name="itemName" value={form.itemName} onChange={handleChange} required />
          <small className="error">{errors.itemName}</small>
        </div>

        <div className="form-group">
          <label>Price (₹):</label>
          <input type="number" name="price" value={form.price} onChange={handleChange} required />
          <small className="error">{errors.price}</small>
        </div>

        <div className="form-group">
          <label>Item Image (max 2MB):</label>
          <input type="file" name="image" accept="image/*" capture="environment" onChange={handleChange} required />
          <small className="error">{errors.image}</small>
          {preview && <img src={preview} alt="Preview" className="preview" />}
        </div>

        <div className="form-group">
          <label>Item Condition (max 25 words):</label>
          <textarea name="condition" rows="3" value={form.condition} onChange={handleChange}></textarea>
          <small className="error">{errors.condition}</small>
        </div>

        <button type="submit" disabled={!location || locationDenied}>Upload Product</button>
        {!location && locationDenied && (
          <p className="error">Location permission is required to upload.</p>
        )}
      </form>
    </div>
  );
};

export default UploadProduct;
