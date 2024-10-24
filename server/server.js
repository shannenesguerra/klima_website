const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user.model'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const otpStore = {};
const fs = require('fs').promises;
const app = express();
const port = 5000;
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key';
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://shannenesguerra08:A7ttH0mJ8lVd1orB@klima.lhjba.mongodb.net/klima')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']; // Get the token from the 'Authorization' header
  const token = authHeader && authHeader.split(' ')[1]; // 'Bearer <token>'

  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user; // Store the user's data in the request object
    next(); // Call next() to move to the next middleware or route handler
  });
}

// Middleware to read and verify token from token.txt
const verifyTokenFromFile = (req, res, next) => {
  const tokenFilePath = './public/Game/Token/token.txt';

  fs.readFile(tokenFilePath, 'utf8', (err, token) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading token file' });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      req.user = decoded; // Attach user info to request object
      next(); // Proceed to next middleware or route handler
    });
  });
};

// Sign up
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username ||  !email ||  !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Create token with user ID
    const token = jwt.sign({ userId: newUser._id }, secretKey, { expiresIn: '24h' });

    res.status(201).json({ message: 'User registered successfully', token });
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

    // Check if user exists and if password matches
    if (user && await bcrypt.compare(password, user.password)) {
      // Create token with user ID
      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '24h' });

      // Save token to a file (this will overwrite the existing token)
      const filePath = './public/Game/Token/token.txt'; // Path to the token file
      await fs.writeFile(filePath, token); // Write the new token to the file

      res.status(200).json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}); 

// Validate token endpoint
app.get('/api/validate-token', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Token is valid' });
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

// Protected route to get user data
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); // req.user is set by the middleware
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      username: user.username,
      email: user.email,
      // Include any other user-related information you want to return
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get high scores for each world
app.get('/api/leaderboards', async (req, res) => {
  try {
    // Fetch users sorted by their scores in each world
    const world1Scores = await User.find({})
      .sort({ world1: -1 }) // Sort by world1 score descending
      .limit(10) // Get top 10
      .select('username world1'); // Select fields to return

    const world2Scores = await User.find({})
      .sort({ world2: -1 }) // Sort by world2 score descending
      .limit(10) // Get top 10
      .select('username world2');

    const world3Scores = await User.find({})
      .sort({ world3: -1 }) // Sort by world3 score descending
      .limit(10) // Get top 10
      .select('username world3');

    res.json({
      world1: world1Scores,
      world2: world2Scores,
      world3: world3Scores,
    });
  } catch (error) {
    console.error('Error fetching high scores:', error);
    res.status(500).json({ message: 'Server error while fetching high scores' });
  }
}); 



// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
