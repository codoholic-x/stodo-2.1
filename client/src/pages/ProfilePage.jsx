import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileHeader from '../components/ProfileHeader';
import ProfileStats from '../components/ProfileStats';
import '../styles/profile.css';

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    axios.get('/api/profile')
      .then(res => {
        setUser(res.data);
        setProfileImage(res.data.profileImage);
      })
      .catch(err => console.error("❌ Failed to load profile", err));
  }, []);

  return (
    <div className="profile-container">
      <ProfileHeader user={user} profileImage={profileImage} setProfileImage={setProfileImage} />
      <ProfileStats user={user} />
    </div>
  );
};

export default ProfilePage;
