import React, { useState } from 'react';
import loading from '../img/earth.gif';
import arrow from '../img/arrow.png';
import '../css/login.css';

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(''); // Error state

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(''); // Clear any previous errors

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.username) {
          localStorage.setItem('username', data.username);

          // Delay before redirecting to the account page
          setTimeout(() => {
            setIsLoading(false);
            window.location.href = '/account'; // Redirect to Account page after delay
          }, 5000); // 5 seconds delay
        } else {
          console.error('Username not found in response.');
          setError('Username not found. Please check your credentials.');
          setIsLoading(false); // Hide loading screen if username is not found
        }
      } else {
        console.error(data.message);
        setError('Login failed. Please check your credentials.');
        setIsLoading(false); // Hide loading screen if response is not okay
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred. Please try again later.');
      setIsLoading(false); // Hide loading screen on error
    }
  };

  return (
    <div className="background_login">
      {isLoading ? (
        <div className='loading_container'>
          <div className="loading_screen">
            <img src={loading} alt="Loading..." />
          </div>
        </div>
      ) : (
        <div className="login">
          <header className="header" id="header">
            <div className="logo_img">
              {/* <img src="#" alt="Logo" /> */}
            </div>
          </header>
          <main className="main">
            <section className="login section" id="login">
              <div className="login_container">
                <form className="login_form" onSubmit={handleSubmit}>
                  <h2 className="login_title">LOGIN</h2>
                  <input
                    type="text"
                    className='email_txtbox'
                    placeholder="EMAIL OR USERNAME"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                  />
                  <input
                    type="password"
                    className='pass_txtbox'
                    placeholder="PASSWORD"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <p className="forgotpass_btn"><a href="/forgotpass">FORGOT PASSWORD</a></p>

                  <button type="submit" className="loginbtn">
                    <img src={arrow} alt="Arrow" />
                  </button>
                  
                  <p className="signup_btn"><a href="/signup">CREATE ACCOUNT</a></p>
                </form>
                {error && (
                  <div className='modal'>
                    <div className="modal_content">
                      <p className='modal_description'>{error}</p>
                      <button className="modal_close" onClick={() => setError('')}>Close</button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </main>
          <footer className="footer">
            <div className="footer_container">
              <p className="footer_copy">
                &#169; KLIMA 2024 | All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Login;
