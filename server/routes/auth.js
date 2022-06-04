const express = require('express');
const { validationResult, check } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/User');

const validate = [
  check('fullName')
    .isLength({ min: 2 })
    .withMessage('Your full name is required'),
  check('email').isEmail().withMessage('Please provide a valid email'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

router.post('/register', validate, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userExist = await User.findOne({ email: req.body.email });
  if (userExist) return res.status(400).send('Email already exist');

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  try {
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashPassword,
    });

    const savedUser = await user.save();
    res.send({
      id: savedUser._id,
      fullName: savedUser.fullName,
      email: savedUser.email,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

const loginValidation = [
  check('email').isEmail().withMessage('Please provide a valid email'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

router.post('/login', loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //check if user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).send('User is not registered');
  //check if password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(404).send('Invalid Email or Password');

  // create and assign a token
  const token = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_SECRET
  );

  res
    .header('auth-token', token)
    .send({ message: 'Logged in successfully', token });
});

module.exports = router;
