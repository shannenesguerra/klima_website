import React, { useEffect, useState } from 'react';
import '../css/account.css'; 

const Account = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Retrieve username from localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      console.error('No username found in localStorage');
    }
  }, []);

  return (
    <div className="bodyaccounts">
      <div className="containeraccountpage">
        <div className="profile-section">
          <div className="profile-header">
            <img
              src="https://via.placeholder.com/80"
              alt="User Avatar"
              className="profile-image"
            />
            <div className="username">{username}</div>
            <span className="edit-icon">&#x1F512;</span>
          </div>
          <hr />
          <div className="achievements">
            <h3 className="achievementsheader">ACHIEVEMENTS</h3>
            <ul>
              {[...Array(6)].map((_, index) => (
                <li key={index}>
                  <div className="achievement-item">
                    <div className="circle"></div>
                    <div className="box"></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="badges-section">
          <h2 className="badgeheader">BADGES</h2>
          <div className="badges">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="badge"></div>
            ))}
          </div>
        </div>
      </div>
      <button
        type="button"
        className="back-button"
        onClick={() => {
          localStorage.removeItem('username'); // Clear username from localStorage
          window.location.href = '/';
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Account;
