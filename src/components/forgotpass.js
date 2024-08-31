import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/forgotpass.css';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const navigate = useNavigate();

    const handleSendOtp = async () => {
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
                console.log('OTP sent:', data.otp); // For debugging purposes
                setOtpSent(true);
                setStep(2);
            } else {
                console.error('Failed to send OTP:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('OTP verified:', data.message);
                setModalOpen(true);
            } else {
                console.error('Failed to verify OTP:', data.message);
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
        }
    };


    const handleModalClose = () => {
        setModalOpen(false);
        navigate('/changepass');
    };

    return (
        <div className="background_forgotpass">
            <div className="forgot_password">
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
                        <button className="send_otp_btn" onClick={handleSendOtp}>Send OTP</button>
                    </div>
                )}
                {step === 2 && otpSent && (
                    <div>
                        <h2 className='forgot_title'>Enter OTP</h2>
                        <p className='forgot_subtitle'>Please enter the OTP sent to your email.</p>
                        <input
                            type="text"
                            className='forgotpass_otp_txtbox'
                            placeholder="Enter OTP"
                            maxLength="6"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button className="verify_otp_btn" onClick={handleVerifyOtp}>Verify OTP</button>
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
                </div>
            </footer>
            
        </div>
    );
};

export default ForgotPassword;
