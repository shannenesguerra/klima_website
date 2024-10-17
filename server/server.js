const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust path if necessary
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const otpStore = {};

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://shannenesguerra08:A7ttH0mJ8lVd1orB@klima.lhjba.mongodb.net/klima')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sign up
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is taken' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ 
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }] 
    });

    if (user && await bcrypt.compare(password, user.password)) {
      // Send username in response
      res.status(200).json({ message: 'Login successful', username: user.username });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'klima.otp@gmail.com', // Your Gmail address
    pass: 'temu zxkw hcom gael', // Your Gmail password or App Password
  },
});

// Generate OTP function
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP
};

// Send OTP
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
      return res.status(400).json({ message: 'Email is required' });
  }

  try {
      const otp = generateOtp();
      otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 }; // Store OTP with expiration

      const mailOptions = {
          from: 'your-email@gmail.com',
          to: email,
          subject: 'KLIMA | Your One-Time Password (OTP) Code for Secure Access',
          html: `<p>To ensure the security of your account, we require you to enter a One-Time Password (OTP) to proceed with your request.</p>

<p><strong>Your OTP code is: ${otp}</strong></p>

<p>Please enter this code in the required field to continue. This OTP is valid for the next 10 minutes and can only be used once. If you did not request this OTP or believe this email was sent to you in error, please disregard it.</p>

<p>For your security, please do not share this OTP with anyone.</p>

<p><em>***This is a system generated message. <strong>DO NOT REPLY TO THIS EMAIL.</strong>***</em></p>`,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP
app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
  }

  const storedOtp = otpStore[email];
  if (!storedOtp || storedOtp.expires < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired or does not exist' });
  }

  if (storedOtp.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
  }

  // OTP is valid
  delete otpStore[email]; // Clear OTP after successful verification
  res.status(200).json({ message: 'OTP verified successfully' });
});

// Change Password
app.post('/api/change-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
  }

  try {
      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'Failed to change password' });
  }
});

// Update Send OTP route to store OTP
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const otp = generateOtp();

    const mailOptions = {
      from: 's88506612@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Store the OTP in memory with an expiration (e.g., 10 minutes)
    otpStore[email] = otp;
    setTimeout(() => delete otpStore[email], 10 * 60 * 1000);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Build/index.html'));
});

const path = require('path');

// Serve the WebGL build folder as static files
app.use(express.static(path.join(__dirname, 'Build')));


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
