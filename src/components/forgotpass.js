import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import klimalogo from '../img/klima logo.png';
import klimatxt from '../img/klima text.png';
import rerend from '../img/rerend logo.png';
import gp from '../img/gp logo.png';
import '../css/forgotpass.css';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [otpSent, setOtpSent] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSendOtp = async () => {
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setOtpSent(true);
                setStep(2);
                setError('');
            } else {
                setError(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChangeOtp = (element, index) => {
        if (isNaN(element.value)) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Move focus to the next input
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.some(digit => digit === '')) {
            setError('Please enter a complete 6-digit OTP.');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp: otp.join('') }),
            });

            const data = await response.json();

            if (response.ok) {
                setModalOpen(true);
                setError('');
            } else {
                setError(data.message || 'Failed to verify OTP');
                setOtpSent(false);
            }
        } catch (error) {
            setError('An error occurred during OTP verification.');
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setModalOpen(false);
        navigate('/changepass');
    };

    return (
        <div className="background_forgotpass">

            <img src={klimatxt} alt="Top Left" className="corner_img top_left" />

            <div className="forgot_password">
                {error && <p className="error_message">{error}</p>}
                {step === 1 && (
                    <div>
                        <h2 className='forgot_title'>Forgot Password</h2>
                        <p className='forgot_subtitle'>Please enter your email to receive an OTP code.</p>
                        <input
                            type="email"
                            className='forgotpass_email_txtbox'
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button className="send_otp_btn" onClick={handleSendOtp} disabled={loading}>
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </div>
                )}
                {step === 2 && otpSent && (
                    <div>
                        <h2 className='forgot_title'>Enter OTP</h2>
                        <p className='forgot_subtitle'>Please enter the OTP sent to your email.</p>
                        <div className="otp_container">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    className="otp_input"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleChangeOtp(e.target, index)}
                                    onFocus={(e) => e.target.select()}
                                />
                            ))}
                        </div>
                        <button className="verify_otp_btn" onClick={handleVerifyOtp} disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </div>
                )}
            </div>

            {modalOpen && (
                <div className="forgotpass_modal">
                    <div className="forgotpass_modal_content">
                        <h2 className='forgotpass_modal_title'>Success!</h2>
                        <p className='forgotpass_modal_description'>Your OTP has been verified successfully.</p>
                        <button className="forgotpass_modal_close" onClick={handleModalClose}>Continue</button>
                    </div>
                </div>
            )}

            <footer className="footer">
                <div className="footer_container">
                    <p className="footer_copy">
                        &#169; KLIMA 2024 | All rights reserved.
                    </p>
                    {/* logos */}
                    <img src={gp} alt="Bottom Left" className=" bottom_left" />
                    <img src={rerend} alt="Bottom Left" className=" bottom_mid" />
                    <img src={klimalogo} alt="Bottom Right" className=" bottom_right" />

                </div>
            </footer>
        </div>
    );
};

export default ForgotPassword;
