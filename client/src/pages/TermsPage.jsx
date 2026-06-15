import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="terms-container">
      <button className="back-btn" onClick={() => navigate('/profile')}>⬅ Back to Profile</button>
      <h1>Terms & Policies</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis lorem ut libero malesuada feugiat.
        Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Praesent sapien massa, convallis a
        pellentesque nec, egestas non nisi. Pellentesque in ipsum id orci porta dapibus.
      </p>
      <p>
        Vivamus suscipit tortor eget felis porttitor volutpat. Curabitur arcu erat, accumsan id imperdiet et,
        porttitor at sem. Donec sollicitudin molestie malesuada. Cras ultricies ligula sed magna dictum porta.
      </p>
      <p>
        This is a placeholder page. You can update your site's real privacy policy and terms here later.
      </p>
    </div>
  );
};

export default TermsPage;
