/* eslint-disable consistent-return */
require('dotenv').config();
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET_KEY;
const tokenDuration = process.env.JWT_EXPIRES_IN;
const tokenAlgorithm = process.env.JWT_ALGORITHM;

// Function to generate a token
module.exports.generateToken = function (req, res, next) {
  try {
    const { id, username, email } = res.locals; // Extract data from res.locals

    if (!id || !username || !email) {
      return res.status(400).json({ error: 'Missing required user data for token generation' });
    }

    const payload = {
      id,
      username,
      email,
      timestamp: new Date(),
    };

    const options = {
      algorithm: tokenAlgorithm,
      expiresIn: tokenDuration,
    };

    const token = jwt.sign(payload, secretKey, options); // Generate JWT
    res.locals.token = token; // Store token in res.locals for downstream use
    next();
  } catch (err) {
    console.error('Error generating JWT:', err);
    res.status(500).json({ error: 'Token generation failed' });
  }
};

// Function to send the token to the client
module.exports.sendToken = function (req, res) {
  res.status(200).json({
    message: res.locals.message || 'Token generated successfully',
    token: res.locals.token,
    username: res.locals.username,
    email: res.locals.email,
    id: res.locals.id,
  });
};

// Function to verify the token
module.exports.verifyToken = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token

    const decoded = jwt.verify(token, secretKey);

    res.locals.username = decoded.username;
    res.locals.id = decoded.id;
    res.locals.tokenTimestamp = decoded.timestamp;

    next();
  } catch (err) {
    console.error('Error verifying JWT:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
