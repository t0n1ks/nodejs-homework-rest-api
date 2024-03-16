const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

const app = express();
const port = process.env.PORT || 7000;

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? './enviroments/production.env' : './enviroments/development.env',
});

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json());
app.use(cors());

// MIDDLEWARES ==========
app.use((req, res, next) => {
  console.log('Hello from middleware! :3');
  req.time = new Date().toLocaleString('uk-UA');
  next();
});

// CONTROLLERS ==========
app.get('/api/v1/ping', (req, res) => {
  console.log(req.time);
  res.status(200).json({
    msg: 'pong! :)',
  });
});

// ROUTES ========
const contactsRouter = require('./routes/api/contacts');
app.use('/api/contacts', contactsRouter);

// NOT found error handler ======
app.use((req, res) => {
  res.status(404).json({
    msg: 'Oops! Resource not found..',
  });
});

// Global ERROR handler (4 args required!!!) ========
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    msg: err.message,
  });
});

// SERVER =========
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
