import React, { useState } from 'react';
import arrow from '../img/arrow.png';
import { useNavigate } from 'react-router-dom';
import klimalogo from '../img/klima logo.png';
import klimatxt from '../img/klima text.png';
import rerend from '../img/rerend logo.png';
import gp from '../img/gp logo.png';
import '../css/signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const navigate = useNavigate();

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
    setUsernameError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Check if passwords match
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match!");
      return;
    }

    // Validate password strength
    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters long and include a mix of lowercase and uppercase letters, numbers, and special symbols."
      );
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
        // Show modal on successful signup
        setIsModalOpen(true);

        // Hide modal and navigate after a delay
        setTimeout(() => {
          setIsModalOpen(false);
          navigate('/');
        }, 3000); // Modal will disappear after 3 seconds
      } else if (data.message === 'Username is taken') {
        setUsernameError('Username is already taken.');
      } else {
        setPasswordError(`Signup failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setPasswordError('Signup failed. Please try again later.');
    }
  };

  return (
    <div className="background_signup">
      <img src={klimatxt} alt="Top Left" className="corner_img top_left" />

      <div className="signup">
        <header className="header" id="header">
          <div className="logo_img"></div>
        </header>

        <main className="main">
          <section className="signup section" id="signup">
            <div className="signup_container">
              <form className="signup_form" onSubmit={handleSubmit}>
                <h2 className="signup_title">SIGN UP</h2>
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
                  {/* Display error */}
                  {usernameError && <p className="error_text">{usernameError}</p>} 
                  {passwordError && <p className="error_text">{passwordError}</p>}
                  {confirmPasswordError && <p className="error_text">{confirmPasswordError}</p>}

                <button type="submit" className="signupbtn">
                  <img src={arrow} alt="Arrow" />
                </button>
                <p className="login_btn"><a href="/">ALREADY HAVE AN ACCOUNT?</a></p>
              </form>
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="footer_container">
            <p className="footer_copy">
              &#169; KLIMA 2024 | All rights reserved.
            </p>
            <img src={gp} alt="Bottom Left" className=" bottom_left" />
            <img src={rerend} alt="Bottom Left" className=" bottom_left" />
            <img src={klimalogo} alt="Bottom Right" className=" bottom_right" />            
          </div>
        </footer>

        {/* Modal for successful signup */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal_content">
              <h3 className='modal_title'>Signup Successful!</h3>
              <p className='modal_phrase'>Welcome, <strong>{username}!</strong> Redirecting to the log in page...</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Signup;
