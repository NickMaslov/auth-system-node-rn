const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
app.use(express.json());

const authRoutes = require('./routes/auth');

app.use('/api/users', authRoutes);

app.get('/', (req, res) => res.send('Welcome to the auth system'));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(3000, () => console.log('Server is running!'));
  })
  .catch((e) => console.log(e));
