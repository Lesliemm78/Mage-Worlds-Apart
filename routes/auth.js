const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, password });
  newUser.save((err) => {
    if (err) return res.status(500).send('Error registering new user.');
    res.status(200).send('User registered successfully.');
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }, (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');
    user.comparePassword(password, (err, isMatch) => {
      if (err) return res.status(500).send('Error on the server.');
      if (!isMatch) return res.status(401).send('Password is incorrect.');
      const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: 86400 });
      res.status(200).send({ auth: true, token });
    });
  });
});

module.exports = router;