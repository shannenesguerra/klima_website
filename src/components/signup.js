import React, { useState } from 'react';
import arrow from '../img/arrow.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../css/signup.css'; 

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate(); // Initialize the navigate function

  // Function to validate password
  const validatePassword = (password) => {
    const lengthCheck = password.length >= 8;
    const lowercaseCheck = /[a-z]/.test(password);
    const uppercaseCheck = /[A-Z]/.test(password);
    const numberCheck = /[0-9]/.test(password);
    const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return lengthCheck && lowercaseCheck && uppercaseCheck && numberCheck && specialCharCheck;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setModalMessage("Passwords do not match!");
      setIsError(true);
      setShowModal(true);
      return;
    }

    if (!validatePassword(password)) {
      setModalMessage("Password must be at least 8 characters long and include a mix of lowercase and uppercase letters, numbers, and special symbols.");
      setIsError(true);
      setShowModal(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setModalMessage('Signup successful!');
        setIsError(false);
        setShowModal(true);
        
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/'); // Redirect to the login page
        }, 2000); // 2-second delay before redirecting
      } else {
        setModalMessage(`Signup failed: ${data.message}`);
        setIsError(true);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setModalMessage('Signup failed');
      setIsError(true);
      setShowModal(true);
    }
  };

  return (
    <div className="background_signup">
    <div className="signup">
      {/* Header */}
      <header className="header" id="header">
        <div className="logo_img">
          {/* <img src="#" alt="Logo" /> */}
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <section className="signup section" id="signup">
          <div className="signup_container">
            <form className="signup_form" onSubmit={handleSubmit}>
              <h2 className="signup_title">SIGNUP</h2>
              <input
                type="text"
                className='user_txtbox'
                placeholder="USERNAME"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="email"
                className='email_txtbox'
                placeholder="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                className='pass_txtbox'
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                className='confirmpass_txtbox'
                placeholder="CONFIRM PASSWORD"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit" className="signupbtn">
                <img src={arrow} alt="Arrow" />
              </button>
              <p className="login_btn"><a href="/">ALREADY HAVE AN ACCOUNT?</a></p>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer_container">
          <p className="footer_copy">
            &#169; KLIMA 2024 | All rights reserved.
          </p>
        </div>
      </footer>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal_content">
            <p className='modal_description'>{modalMessage}</p>
            <button className="modal_close" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Signup;