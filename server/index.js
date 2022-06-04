require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const authRoutes = require('./routes/auth');
const verifyToken = require('./routes/verifyToken');

app.use('/api/user/profile', verifyToken, (req, res) =>
  res.send('this is the user profile')
);
app.use('/api/users', authRoutes);

app.get('/', (req, res) => res.send('Welcome to the auth system'));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(3000, () => console.log('Server is running!'));
  })
  .catch((e) => console.log(e));
