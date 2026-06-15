import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileStats = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="profile-stats">
      <div onClick={() => navigate('/sell')}>
        🏬 Sell Product on STODO : {user.sellCount || 0}
      </div>
      <div onClick={() => navigate('/buy')}>
        💰 Buy Product on STODO : {user.buyCount || 0}
      </div>
      <div onClick={() => navigate('/deleted')}>
        🔒 Deleted Products
      </div>
      <div onClick={() => alert(`👤 ${user.username}\n📧 ${user.email}`)}>
        👤 User
      </div>
      <div onClick={() => navigate('/terms')}>
        📄 Terms, Policies
      </div>
    </div>
  );
};

export default ProfileStats;
