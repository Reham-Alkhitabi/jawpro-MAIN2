import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/logout';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <button onClick={handleLogout} style={{ marginLeft: 'auto' }}>
      Logout
    </button>
  );
}

export default LogoutButton;
