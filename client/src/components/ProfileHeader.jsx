import React, { useRef } from 'react';
import axios from 'axios';

const ProfileHeader = ({ user, profileImage, setProfileImage }) => {
  const fileRef = useRef();

  const handleImageChange = async (e) => {
    const formData = new FormData();
    formData.append("profileImage", e.target.files[0]);

    const res = await axios.post('/api/profile/upload', formData);
    setProfileImage(res.data.imageUrl);
  };

  return (
    <div className="profile-header">
      <div className="user-info">
        <h3>{user.username || "Username"}</h3>
        <p>Explore &lt; STODO Products &gt;</p>
      </div>
      <div className="profile-image" onClick={() => fileRef.current.click()}>
        <img src={profileImage || '/default-user.png'} alt="Profile" />
        <input type="file" hidden ref={fileRef} onChange={handleImageChange} />
      </div>
    </div>
  );
};

export default ProfileHeader;
