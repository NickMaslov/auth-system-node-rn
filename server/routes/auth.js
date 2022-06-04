const express = require('express');

const router = express.Router();

const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
    });

    const savedUser = await user.save();
    res.send(savedUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/login', (req, res) => {
  res.send('login route');
});

module.exports = router;
